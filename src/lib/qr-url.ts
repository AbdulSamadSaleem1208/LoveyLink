/** Query param added to love-page URLs encoded in QR codes for scan attribution. */
export const QR_SOURCE_PARAM = "src";
export const QR_SOURCE_VALUE = "qr";

/**
 * Appends ?src=qr (or &src=qr) so love-page visits can be counted as QR scans.
 */
export function withQrSourceParam(url: string): string {
    try {
        const parsed = new URL(url);
        parsed.searchParams.set(QR_SOURCE_PARAM, QR_SOURCE_VALUE);
        return parsed.toString();
    } catch {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}${QR_SOURCE_PARAM}=${QR_SOURCE_VALUE}`;
    }
}

export function isQrSourceVisit(
    searchParams: Record<string, string | string[] | undefined> | undefined
): boolean {
    const raw = searchParams?.[QR_SOURCE_PARAM];
    if (raw === QR_SOURCE_VALUE) return true;
    if (Array.isArray(raw)) return raw.includes(QR_SOURCE_VALUE);
    return false;
}
