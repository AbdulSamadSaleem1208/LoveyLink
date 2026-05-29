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
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%)",
                            }}
                        />
                    </div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
                        <Heart
                            className="h-8 w-8 fill-pink-heart text-pink-heart drop-shadow-lg animate-pulse"
                        />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 text-white/90 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-pink-heart" />
                        <span>Our special moment</span>
                        <Sparkles className="h-4 w-4 text-pink-heart" />
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
                            className="relative bg-white p-2 pb-10 rounded-sm shadow-xl"
                            style={{
                                transform: `rotate(${idx % 2 === 0 ? -2 : 2}deg)`,
                            }}
                        >
                            <div className="relative aspect-square overflow-hidden rounded-sm">
                                <Image
                                    src={img}
                                    alt={`Love memory ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 320px"
                                />
                            </div>
                            <p
                                className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium"
                                style={{ color: primaryColor }}
                            >
                                ♥ Memory {idx + 1}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
