import { createAdminClient } from "@/lib/supabase/admin";
import { getCanonicalSiteUrl } from "@/lib/site-url";
import { withQrSourceParam } from "@/lib/qr-url";

type ScanMeta = {
    ip?: string | null;
    userAgent?: string | null;
};

/**
 * Records a QR scan in qr_scans (admin dashboard reads this table).
 * Ensures a qr_codes row exists for the page.
 */
export async function recordQrScan(pageId: string, meta: ScanMeta = {}): Promise<void> {
    const admin = createAdminClient();
    if (!admin) {
        console.warn("[qr-scan] SUPABASE_SERVICE_ROLE_KEY missing; scan not recorded");
        return;
    }

    let { data: qr, error: lookupError } = await admin
        .from("qr_codes")
        .select("id")
        .eq("page_id", pageId)
        .maybeSingle();

    if (lookupError) {
        console.error("[qr-scan] lookup failed:", lookupError.message);
        return;
    }

    if (!qr) {
        const { data: page, error: pageError } = await admin
            .from("love_pages")
            .select("slug")
            .eq("id", pageId)
            .single();

        if (pageError || !page?.slug) {
            console.error("[qr-scan] page lookup failed:", pageError?.message);
            return;
        }

        const trackUrl = withQrSourceParam(`${getCanonicalSiteUrl()}/lp/${page.slug}`);
        const { data: created, error: createError } = await admin
            .from("qr_codes")
            .insert({ page_id: pageId, qr_data: trackUrl })
            .select("id")
            .single();

        if (createError || !created) {
            console.error("[qr-scan] qr_codes insert failed:", createError?.message);
            return;
        }
        qr = created;
    }

    const { error: scanError } = await admin.from("qr_scans").insert({
        qr_id: qr.id,
        scanner_ip: meta.ip ?? null,
        scanner_device: meta.userAgent ?? null,
    });

    if (scanError) {
        console.error("[qr-scan] insert failed:", scanError.message);
    }
}
