import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import QRDisplay from "@/components/qr/QRDisplay";
import Link from "next/link";
import { CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { headers } from "next/headers";
import { resolveSiteUrlFromHost } from "@/lib/site-url";
import { repairBrokenSlugForPage } from "@/lib/love-page-slug-repair";
import { isBrokenSlug } from "@/lib/slug";
import { withQrSourceParam } from "@/lib/qr-url";

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
    const qrTrackUrl = withQrSourceParam(publicUrl);
    const hadBrokenSlug = repaired || isBrokenSlug(page.slug);

    const { data: qr } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('page_id', page.id)
        .maybeSingle();

    if (!qr) {
        await supabase.from("qr_codes").insert({
            page_id: page.id,
            qr_data: qrTrackUrl,
        });
    } else if (repaired || qr.qr_data !== qrTrackUrl) {
        await supabase.from("qr_codes").update({ qr_data: qrTrackUrl }).eq("page_id", page.id);
    }

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative max-w-2xl w-full overflow-hidden rounded-3xl border border-pink-heart/25 bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-pink-heart/10 p-8 md:p-12 text-center shadow-[0_20px_60px_rgba(255,107,157,0.15)] animate-fade-in">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,107,157,0.18)_0%,transparent_55%)]"
                    aria-hidden
                />

                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-pink-heart/30 to-red-primary/20 border border-pink-heart/40 flex items-center justify-center shadow-[0_0_28px_rgba(255,107,157,0.35)]">
                            <CheckCircle className="h-10 w-10 text-pink-heart" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">Published Successfully!</h1>
                    <p className="text-text-secondary mb-8">
                        Your love page representing{" "}
                        <span className="font-semibold text-pink-heart">{page.title}</span> is now live.
                    </p>

                    {hadBrokenSlug && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-left text-sm text-amber-100">
                            <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                            <p>
                                {repaired
                                    ? "Your share link was invalid and has been fixed. Download or share the new QR code below — old QR codes will not work."
                                    : "Your share link may be invalid. Open this page from the dashboard after adding a recipient name, or create a new page."}
                            </p>
                        </div>
                    )}

                    <p className="text-xs text-gray-400 mb-4 break-all font-mono">{publicUrl}</p>

                    <QRDisplay url={publicUrl} title={page.title} message={page.message} />

                    <div className="mt-10 border-t border-white/10 pt-8">
                        <Link
                            href="/dashboard"
                            className="text-text-muted hover:text-pink-light flex items-center justify-center transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
