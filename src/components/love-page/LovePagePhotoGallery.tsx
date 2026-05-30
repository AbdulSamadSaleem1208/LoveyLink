"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const PINK = "#FF6B9D";

type Props = {
    images: string[];
    primaryColor?: string;
    compact?: boolean;
};

export default function LovePagePhotoGallery({
    images,
    primaryColor = PINK,
    compact = false,
}: Props) {
    if (!images.length) return null;

    const sectionMb = compact ? "mb-8" : "mb-12";
    const singleMaxW = compact ? "max-w-sm" : "max-w-2xl";

    if (images.length === 1) {
        return (
            <motion.div
                initial={compact ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                whileInView={compact ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: compact ? 0.3 : 0.6, ease: "easeOut" }}
                className={`relative z-10 w-full ${singleMaxW} mx-auto ${sectionMb} px-4`}
            >
                <div className="relative w-full overflow-hidden rounded-2xl bg-black/30 shadow-lg ring-1 ring-white/10">
                    <div
                        className={`relative w-full ${
                            compact ? "min-h-[200px] max-h-[280px]" : "min-h-[240px] max-h-[min(70vh,640px)]"
                        }`}
                    >
                        <Image
                            src={images[0]}
                            alt="Love memory"
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, 672px"
                        />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className={`relative z-10 w-full max-w-6xl mx-auto ${sectionMb} px-4`}>
            <div
                className={
                    images.length === 2
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                }
            >
                {images.map((img, idx) => (
                    <motion.div
                        key={img}
                        initial={
                            compact
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        whileInView={compact ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: compact ? 0 : idx * 0.08,
                            duration: 0.5,
                        }}
                        className="relative overflow-hidden rounded-2xl bg-black/30 shadow-md ring-1 ring-white/10"
                    >
                        <div className="relative aspect-square w-full">
                            <Image
                                src={img}
                                alt={`Love memory ${idx + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 320px"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
