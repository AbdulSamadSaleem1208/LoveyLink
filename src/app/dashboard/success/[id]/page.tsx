import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import QRDisplay from "@/components/qr/QRDisplay";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { headers } from "next/headers";

// Force dynamic rendering - NEVER cache this page (contains user-specific data)
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

    // Determine the base URL dynamically
    const headerStack = await headers();
    const host = headerStack.get("host") || "";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";

    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
        if (host) {
            // Remove any trailing slash from host if it exists (unlikely in host header)
            const cleanHost = host.replace(/\/$/, "");
            siteUrl = `${protocol}://${cleanHost}`;
        } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
            siteUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
        } else if (process.env.VERCEL_URL) {
            siteUrl = `https://${process.env.VERCEL_URL}`;
        } else {
            // Ultimate fallback
            siteUrl = "https://loveylink.net";
        }
    }

    // Ensure siteUrl doesn't have a trailing slash for consistent joining
    siteUrl = siteUrl.replace(/\/$/, "");

    if (!page.slug) {
        console.error("Page slug is missing for page:", id);
        return notFound();
    }

    const publicUrl = `${siteUrl}/lp/${page.slug}`;

    // Log QR creation if not exists (Server side logic)
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
    }

    return (
        <div className="min-h-screen bg-[#FFF1F2] flex flex-col items-center justify-center p-4">
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
