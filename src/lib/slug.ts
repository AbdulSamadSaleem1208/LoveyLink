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
    const slug = base ? `${base}-${suffix}` : `page-${suffix}`
    return slug.replace(/-+/g, '-')
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
