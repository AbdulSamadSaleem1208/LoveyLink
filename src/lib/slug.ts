/** Valid love page slug: starts with a letter/number, segments separated by single hyphens */
export const LOVE_PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Build a URL-safe slug for love pages (a-z, 0-9, hyphens only).
 */
export function buildLovePageSlug(recipientName: string): string {
    const base = recipientName
        .toLowerCase()
        .trim()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48)

    const suffix = Math.random().toString(36).substring(2, 7)
    let slug = base ? `${base}-${suffix}` : `page-${suffix}`
    slug = slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '')

    if (!slug || !LOVE_PAGE_SLUG_PATTERN.test(slug)) {
        return `page-${suffix}`
    }

    return slug
}

/**
 * True when slug is missing or invalid (e.g. old bug produced "-abc12" with no name prefix).
 */
export function isBrokenSlug(slug: string | null | undefined): boolean {
    if (!slug || typeof slug !== 'string') {
        return true
    }
    return !LOVE_PAGE_SLUG_PATTERN.test(slug)
}

/**
 * Normalize slug from dynamic route segment (decode URI, trim).
 */
export function normalizeSlugParam(rawSlug: string): string {
    try {
        return decodeURIComponent(rawSlug).trim()
    } catch {
        return rawSlug.trim()
    }
}

/**
 * Public path for a love page (safe for links and QR codes).
 */
export function buildPublicLovePagePath(slug: string): string {
    return `/lp/${encodeURIComponent(slug)}`
}
