/**
 * Normalize display names: trim, collapse spaces, drop consecutive duplicate words
 * (e.g. "Abdul Samad Saleem Saleem" → "Abdul Samad Saleem").
 */
export function normalizeFullName(name: string | null | undefined): string {
    if (!name) return "";

    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";

    const deduped: string[] = [];
    for (const part of parts) {
        const prev = deduped[deduped.length - 1];
        if (prev && prev.localeCompare(part, undefined, { sensitivity: "accent" }) === 0) {
            continue;
        }
        deduped.push(part);
    }

    return deduped.join(" ");
}

export function resolveDisplayName(options: {
    profileFullName?: string | null;
    metadataFullName?: string | null;
    email?: string | null;
    fallback?: string;
}): string {
    const raw =
        options.profileFullName?.trim() ||
        options.metadataFullName?.trim() ||
        "";

    const normalized = normalizeFullName(raw);
    if (normalized) return normalized;

    const emailLocal = options.email?.split("@")?.[0]?.trim();
    if (emailLocal) {
        const fromEmail = normalizeFullName(emailLocal.replace(/[._+-]/g, " "));
        if (fromEmail) return fromEmail;
    }

    return options.fallback ?? "Member";
}

/** First word of the normalized full name (for short greetings). */
export function getFirstNameFromFullName(fullName: string): string {
    const normalized = normalizeFullName(fullName);
    return normalized.split(/\s+/)[0] || normalized || "there";
}
