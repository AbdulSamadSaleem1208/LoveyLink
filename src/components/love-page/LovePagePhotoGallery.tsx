"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const PINK = "#FF6B9D";
const PINK_LIGHT = "#FFB3C6";

type Props = {
    images: string[];
    primaryColor?: string;
};

function PhotoCaptionBar({
    label,
    primaryColor,
    className = "",
}: {
    label: string;
    primaryColor: string;
    className?: string;
}) {
    return (
        <div
            className={`mx-auto w-full max-w-[92%] rounded-2xl border border-white/20 bg-black/55 px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
        >
            <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {label}
                </span>
                <Sparkles className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
            </div>
        </div>
    );
}

function ImageScrim() {
    return (
        <>
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, rgba(8,8,12,0.92) 0%, rgba(8,8,12,0.55) 22%, rgba(8,8,12,0.2) 45%, transparent 68%)",
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
                }}
            />
        </>
    );
}

export default function LovePagePhotoGallery({ images, primaryColor = PINK }: Props) {
    if (!images.length) return null;

    if (images.length === 1) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg mx-auto mb-16 px-4"
            >
                <div
                    className="absolute -inset-3 rounded-[3rem] opacity-60 blur-2xl"
                    style={{
                        background: `linear-gradient(135deg, ${primaryColor}40, ${PINK_LIGHT}30)`,
                    }}
                />
                <div
                    className="relative overflow-hidden shadow-2xl"
                    style={{
                        borderRadius: "3rem 3rem 1.5rem 1.5rem",
                        border: `3px solid ${PINK_LIGHT}`,
                        boxShadow: `0 25px 60px -15px ${primaryColor}66, 0 0 0 1px rgba(255,255,255,0.1) inset`,
                    }}
                >
                    <div className="relative aspect-[3/4] w-full">
                        <Image
                            src={images[0]}
                            alt="Love memory"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 480px"
                        />
                        <ImageScrim />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
                        <Heart className="h-8 w-8 fill-pink-heart text-pink-heart drop-shadow-lg animate-pulse" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-20">
                        <PhotoCaptionBar label="Our special moment" primaryColor={primaryColor} />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative z-10 w-full max-w-6xl mx-auto mb-16 px-4">
            <div
                className={
                    images.length === 2
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-8"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                }
            >
                {images.map((img, idx) => (
                    <motion.div
                        key={img}
                        initial={{ opacity: 0, y: 30, rotate: idx % 2 === 0 ? -3 : 3 }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12, type: "spring", stiffness: 120 }}
                        className="group relative"
                    >
                        <div
                            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${PINK_LIGHT})`,
                            }}
                        />
                        <div
                            className="relative overflow-hidden rounded-2xl shadow-xl border border-white/10"
                            style={{
                                transform: `rotate(${idx % 2 === 0 ? -2 : 2}deg)`,
                                boxShadow: `0 20px 50px -12px ${primaryColor}44`,
                            }}
                        >
                            <div className="relative aspect-square w-full overflow-hidden">
                                <Image
                                    src={img}
                                    alt={`Love memory ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 320px"
                                />
                                <ImageScrim />
                                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-14">
                                    <PhotoCaptionBar
                                        label={`Memory ${idx + 1}`}
                                        primaryColor={primaryColor}
                                        className="max-w-full py-2.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
