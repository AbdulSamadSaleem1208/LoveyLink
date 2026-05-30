"use client";

import { useEffect, useState } from "react";
import { toSpotifyEmbedUrl } from "@/lib/spotify-url";

interface Props {
    url: string;
}

export default function SpotifyEmbed({ url }: Props) {
    const [hasMounted, setHasMounted] = useState(false);
    const embedUrl = toSpotifyEmbedUrl(url);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted || !embedUrl) return null;

    return (
        <div className="w-full max-w-md mx-auto">
            <iframe
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: '12px' }}
            />
        </div>
    );
}
