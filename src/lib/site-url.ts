const CANONICAL_SITE_URL = 'https://loveylink.net'

/**
 * Canonical public site URL for share links, auth redirects, and QR codes.
 */
export function getCanonicalSiteUrl(): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (fromEnv) {
        return fromEnv
    }
    return CANONICAL_SITE_URL
}

/**
 * Resolve site URL from request headers (e.g. success page) with canonical fallback.
 */
export function resolveSiteUrlFromHost(host: string | null): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    }

    if (host) {
        const cleanHost = host.replace(/\/$/, '')
        const protocol =
            cleanHost.includes('localhost') || cleanHost.includes('127.0.0.1')
                ? 'http'
                : 'https'
        return `${protocol}://${cleanHost}`
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    return CANONICAL_SITE_URL
}
