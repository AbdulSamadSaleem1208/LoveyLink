"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import SpotifyEmbed from "./SpotifyEmbed";
import LovePagePhotoGallery from "./LovePagePhotoGallery";
import FloatingHearts from "@/components/ui/FloatingHearts";

export interface LovePageData {
    title: string;
    recipient_name: string;
    sender_name: string;
    message: string;
    images: string[];
    music_url?: string;
    theme_config?: {
        primaryColor?: string;
        backgroundColor?: string;
        fontFamily?: string;
        effects?: string[];
    };
}

const DEFAULT_PINK = "#FF6B9D";

export default function LovePageRenderer({
    data,
    preview = false,
}: {
    data: LovePageData;
    preview?: boolean;
}) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const bgColor = data.theme_config?.backgroundColor || "#0a0a0a";
    const primaryColor = data.theme_config?.primaryColor || DEFAULT_PINK;
    const isDarkBg =
        !data.theme_config?.backgroundColor ||
        data.theme_config.backgroundColor === "#000000" ||
        data.theme_config.backgroundColor.toLowerCase() === "#0a0a0a";

    const textMuted = isDarkBg ? "text-gray-300" : "text-gray-700";
    const textBody = isDarkBg ? "text-gray-200" : "text-gray-800";

    if (!hasMounted) {
        return (
            <div
                className="min-h-screen w-full flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
            >
                <Heart className="h-12 w-12 animate-pulse text-pink-heart fill-pink-heart" />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen w-full overflow-x-hidden flex flex-col items-center py-12 px-4 relative"
            style={{
                backgroundColor: bgColor,
                fontFamily: data.theme_config?.fontFamily || "var(--font-outfit)",
            }}
        >
            <FloatingHearts count={6} />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at top, ${primaryColor}18 0%, transparent 55%)`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 max-w-4xl w-full"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="inline-block mb-6"
                >
                    <div className="relative">
                        <div
                            className="absolute inset-0 blur-2xl rounded-full opacity-50"
                            style={{ backgroundColor: primaryColor }}
                        />
                        <Heart className="relative h-20 w-20 mx-auto text-pink-heart fill-pink-heart drop-shadow-[0_0_20px_rgba(255,107,157,0.6)] animate-pulse" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-4xl md:text-7xl font-bold mb-6 drop-shadow-sm"
                    style={{ color: primaryColor }}
                >
                    {data.title || "My Love Page"}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <p className={`text-xl md:text-2xl font-light ${textMuted}`}>
                        To my dearest,
                    </p>
                    <h2
                        className="text-3xl md:text-5xl font-serif mt-2 mb-4"
                        style={{ color: primaryColor }}
                    >
                        {data.recipient_name || "Recipient Name"}
                    </h2>
                </motion.div>
            </motion.div>

            <LovePagePhotoGallery images={data.images} primaryColor={primaryColor} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center z-10 mx-auto border ${
                    isDarkBg
                        ? "bg-white/5 border-pink-heart/20"
                        : "bg-white/70 border-pink-heart/30"
                }`}
            >
                <p
                    className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-serif italic ${textBody}`}
                >
                    &ldquo;{data.message || "Write your beautiful message here..."}&rdquo;
                </p>

                <div
                    className={`mt-8 pt-8 border-t ${isDarkBg ? "border-white/10" : "border-pink-heart/20"}`}
                >
                    <p className={`text-sm uppercase tracking-widest ${textMuted}`}>
                        With all my love
                    </p>
                    <p className="text-2xl font-bold mt-2" style={{ color: primaryColor }}>
                        {data.sender_name || "Your Name"}
                    </p>
                </div>
            </motion.div>

            {data.music_url && !preview && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 w-full max-w-md mx-auto z-10"
                >
                    <SpotifyEmbed url={data.music_url} />
                </motion.div>
            )}

            <div className={`mt-20 text-center text-sm z-10 pb-10 ${textMuted}`}>
                <p>
                    Created with{" "}
                    <Heart className="inline h-3.5 w-3.5 text-pink-heart fill-pink-heart" /> using
                    LoveyLink
                </p>
            </div>
        </div>
    );
}
