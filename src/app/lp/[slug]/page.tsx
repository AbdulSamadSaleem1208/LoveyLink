import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import LovePageRenderer from "@/components/love-page/LovePageRenderer";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { normalizeSlugParam } from "@/lib/slug";
import { isQrSourceVisit } from "@/lib/qr-url";
import { recordQrScan } from "@/lib/qr-scan";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type LovePageRow = {
    id: string;
    user_id: string;
    slug: string;
    title: string;
    recipient_name: string;
    sender_name: string;
    message: string;
    theme_config: Record<string, unknown>;
    images: string[];
    music_url: string | null;
    published: boolean;
};

async function fetchLovePageBySlug(slug: string): Promise<LovePageRow | null> {
    const admin = createAdminClient();
    const client = admin ?? await createServerClient();

    const { data, error } = await client
        .from('love_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error) {
        console.error("Love page fetch error:", error.message, { slug });
        return null;
    }

    return data as LovePageRow | null;
}

async function canViewPage(page: LovePageRow): Promise<boolean> {
    if (page.published) {
        return true;
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user && user.id === page.user_id;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const slug = normalizeSlugParam(resolvedParams.slug);
        const page = await fetchLovePageBySlug(slug);

        if (!page) {
            return { title: 'Love Page Not Found' };
        }

        return {
            title: `${page.title} - For ${page.recipient_name}`,
            description: `A special love page dedicated to ${page.recipient_name}.`,
        };
    } catch (error) {
        console.error("Metadata generation error:", error);
        return { title: 'Love Link' };
    }
}

export default async function PublicLovePage({ params, searchParams }: Props) {
    try {
        const resolvedParams = await params;
        const resolvedSearch = await searchParams;
        const slug = normalizeSlugParam(resolvedParams.slug);

        if (!slug) {
            notFound();
        }

        const page = await fetchLovePageBySlug(slug);

        if (!page) {
            notFound();
        }

        const allowed = await canViewPage(page);
        if (!allowed) {
            notFound();
        }

        if (isQrSourceVisit(resolvedSearch)) {
            const supabase = await createServerClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const isOwnerPreview = !!user && user.id === page.user_id;

            if (!isOwnerPreview) {
                const headerList = await headers();
                const forwarded = headerList.get("x-forwarded-for");
                const ip =
                    forwarded?.split(",")[0]?.trim() ??
                    headerList.get("x-real-ip") ??
                    null;

                await recordQrScan(page.id, {
                    ip,
                    userAgent: headerList.get("user-agent"),
                });
            }
        }

        return <LovePageRenderer data={page} />;
    } catch (error) {
        console.error("Public Page Error:", error);
        notFound();
    }
}
