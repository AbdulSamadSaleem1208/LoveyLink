/** Convert open.spotify.com links to embed URLs for iframe playback. */
export function toSpotifyEmbedUrl(url: string): string | null {
    const trimmed = url?.trim();
    if (!trimmed) return null;

    if (trimmed.includes("/embed/")) {
        return trimmed;
    }

    const trackMatch = trimmed.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
        return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
    }

    const albumMatch = trimmed.match(/album\/([a-zA-Z0-9]+)/);
    if (albumMatch) {
        return `https://open.spotify.com/embed/album/${albumMatch[1]}`;
    }

    const playlistMatch = trimmed.match(/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) {
        return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`;
    }

    return trimmed;
}
