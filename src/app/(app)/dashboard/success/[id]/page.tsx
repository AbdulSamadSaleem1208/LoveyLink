import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import QRDisplay from "@/components/qr/QRDisplay";
import Link from "next/link";
import { CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { headers } from "next/headers";
import { resolveSiteUrlFromHost } from "@/lib/site-url";
import { repairBrokenSlugForPage } from "@/lib/love-page-slug-repair";
import { isBrokenSlug } from "@/lib/slug";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>
}

export default async function SuccessPage({ params }: Props) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: page } = await supabase
        .from('love_pages')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!page) notFound();

    const headerStack = await headers();
    const siteUrl = resolveSiteUrlFromHost(headerStack.get("host"));

    if (!page.slug) {
        console.error("Page slug is missing for page:", id);
        return notFound();
    }

    const { slug: repairedSlug, repaired } = await repairBrokenSlugForPage(page, user.id);
    const publicUrl = `${siteUrl}/lp/${repairedSlug}`;
    const hadBrokenSlug = repaired || isBrokenSlug(page.slug);

    const { data: qr } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('page_id', page.id)
        .maybeSingle();

    if (!qr) {
        await supabase.from('qr_codes').insert({
            page_id: page.id,
            qr_data: publicUrl
        });
    } else if (repaired || qr.qr_data !== publicUrl) {
        await supabase.from('qr_codes').update({ qr_data: publicUrl }).eq('page_id', page.id);
    }

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-red-50 animate-fade-in text-gray-900">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Published Successfully!</h1>
                <p className="text-text-muted mb-8">
                    Your love page representing <span className="font-semibold text-red-primary">{page.title}</span> is now live.
                </p>

                {hadBrokenSlug && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-900">
                        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                        <p>
                            {repaired
                                ? "Your share link was invalid and has been fixed. Download or share the new QR code below — old QR codes will not work."
                                : "Your share link may be invalid. Open this page from the dashboard after adding a recipient name, or create a new page."}
                        </p>
                    </div>
                )}

                <p className="text-xs text-gray-500 mb-4 break-all">{publicUrl}</p>

                <QRDisplay url={publicUrl} title={page.title} message={page.message} />

                <div className="mt-10 border-t border-gray-100 pt-8">
                    <Link href="/dashboard" className="text-text-muted hover:text-gray-900 flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
