import { createAdminClient } from '@/lib/supabase/admin'
import { buildLovePageSlug, isBrokenSlug } from '@/lib/slug'
import { getCanonicalSiteUrl } from '@/lib/site-url'

type PageForRepair = {
    id: string
    slug: string
    user_id: string
    recipient_name?: string | null
    title?: string | null
}

/**
 * Fix invalid slugs (e.g. "-l5r5s" from empty recipient name) and refresh stored QR URL.
 */
export async function repairBrokenSlugForPage(
    page: PageForRepair,
    requestingUserId: string
): Promise<{ slug: string; repaired: boolean }> {
    if (!isBrokenSlug(page.slug)) {
        return { slug: page.slug, repaired: false }
    }

    if (page.user_id !== requestingUserId) {
        return { slug: page.slug, repaired: false }
    }

    const admin = createAdminClient()
    if (!admin) {
        console.error('[SlugRepair] Missing SUPABASE_SERVICE_ROLE_KEY')
        return { slug: page.slug, repaired: false }
    }

    const newSlug = buildLovePageSlug(page.recipient_name || page.title || 'love')

    const { error } = await admin
        .from('love_pages')
        .update({ slug: newSlug })
        .eq('id', page.id)
        .eq('user_id', requestingUserId)

    if (error) {
        console.error('[SlugRepair] Update failed:', error.message)
        return { slug: page.slug, repaired: false }
    }

    const publicUrl = `${getCanonicalSiteUrl()}/lp/${newSlug}`

    await admin
        .from('qr_codes')
        .update({ qr_data: publicUrl })
        .eq('page_id', page.id)

    console.log(`[SlugRepair] Repaired page ${page.id}: ${page.slug} -> ${newSlug}`)

    return { slug: newSlug, repaired: true }
}
