"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music2 } from "lucide-react";

const SLIDE_COUNT = 6;
const ROTATE_MS = 5200;

/** Curated romantic Unsplash photos — warm, high-contrast, couple-focused */
const PHOTOS = {
    silhouette: "https://images.unsplash.com/photo-1516589178581-6cd08396b0a7?q=80&w=900&auto=format&fit=crop",
    hands: "https://images.unsplash.com/photo-1522673607218-f9a9b6775f0c?q=80&w=900&auto=format&fit=crop",
    forehead: "https://images.unsplash.com/photo-1520785643436-9e2f72f7f4e0?q=80&w=900&auto=format&fit=crop",
    wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
    sunsetWalk: "https://images.unsplash.com/photo-1529333164204-3a2d3f77c506?q=80&w=900&auto=format&fit=crop",
    roses: "https://images.unsplash.com/photo-1518895949254-959df862fbf0?q=80&w=800&auto=format&fit=crop",
    ring: "https://images.unsplash.com/photo-1515934757210-b34fb1222611?q=80&w=900&auto=format&fit=crop",
    candle: "https://images.unsplash.com/photo-1518568814500-4c191a64a6a0?q=80&w=900&auto=format&fit=crop",
    embrace: "https://images.unsplash.com/photo-1518199265581-640bb5e88697?q=80&w=900&auto=format&fit=crop",
} as const;

function FloatingPhoneHearts() {
    return (
        <>
            {[...Array(5)].map((_, i) => (
                <motion.span
                    key={i}
                    className="absolute text-pink-heart/30 pointer-events-none z-[5]"
                    style={{ left: `${15 + i * 18}%`, bottom: `${12 + (i % 3) * 8}%` }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                        duration: 3.5 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.6,
                    }}
                >
                    <Heart className="w-3 h-3 fill-current" />
                </motion.span>
            ))}
        </>
    );
}

function KenBurnsPhoto({
    src,
    alt,
    className = "",
    zoom = 1.12,
}: {
    src: string;
    alt: string;
    className?: string;
    zoom?: number;
}) {
    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: zoom }}
                transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
            >
                <Image src={src} alt={alt} fill className="object-cover" sizes="300px" unoptimized />
            </motion.div>
        </div>
    );
}

function GlowingHeart({ className = "w-14 h-14" }: { className?: string }) {
    return (
        <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
        >
            <div className="absolute inset-0 bg-pink-heart/40 blur-xl rounded-full scale-150" />
            <Heart className={`${className} text-pink-heart fill-pink-heart relative drop-shadow-[0_0_20px_rgba(255,107,157,0.9)]`} />
        </motion.div>
    );
}

/** Slide 1 — Classic “For my love” + arch hero (matches live love pages) */
function SlideJuliet() {
    return (
        <div className="flex flex-col items-center w-full h-full min-h-[560px] pt-11 px-4 pb-2 bg-black">
            <GlowingHeart />
            <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-bold text-[1.65rem] text-[#ff6b9d] mt-4 mb-2 tracking-tight"
            >
                For my love
            </motion.h2>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-center mb-4"
            >
                <p className="text-gray-400 text-xs">To my dearest,</p>
                <h3 className="font-serif text-[1.75rem] text-[#ff6b9d] mt-0.5">Juliet</h3>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: "spring" }}
                className="w-full flex-1 min-h-[280px] rounded-t-[2.25rem] overflow-hidden border-2 border-white/90 shadow-[0_0_50px_rgba(255,107,157,0.35)] relative"
            >
                <KenBurnsPhoto src={PHOTOS.silhouette} alt="Couple silhouette" zoom={1.15} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-pink-500/15 z-10" />
                <motion.div
                    className="absolute bottom-3 left-0 right-0 text-center z-20"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >
                    <span className="text-[10px] text-white/80 font-medium tracking-widest uppercase">
                        Always & Forever
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
}

/** Slide 2 — Full-bleed cinematic couple */
function SlideCinematic() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <KenBurnsPhoto src={PHOTOS.forehead} alt="Couple" zoom={1.18} />
            <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-transparent to-black z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                >
                    <Sparkles className="w-8 h-8 text-pink-heart mb-3 mx-auto" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white drop-shadow-2xl"
                >
                    You & Me
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-pink-100/90 mt-2 font-serif italic"
                >
                    Every heartbeat spells your name
                </motion.p>
            </div>
        </div>
    );
}

/** Slide 3 — Quote card + music */
function SlideRomeo() {
    return (
        <div className="flex flex-col items-center w-full min-h-full px-4 py-9 pb-14 justify-center bg-gradient-to-b from-zinc-950 to-black">
            <motion.div
                initial={{ opacity: 0, rotateX: 8 }}
                animate={{ opacity: 1, rotateX: 0 }}
                className="bg-gradient-to-br from-neutral-400 via-neutral-500 to-neutral-600 rounded-3xl p-5 w-full shadow-2xl ring-1 ring-white/25"
            >
                <p className="font-serif italic text-[#1a2634] text-[13px] leading-relaxed text-center">
                    &ldquo;Every moment with you feels like a dream I never want to wake from. In this
                    world, my heart always chooses you.&rdquo;{" "}
                    <span className="text-[#ff6b9d]">♥</span>
                </p>
                <div className="w-full h-px bg-white/50 my-4" />
                <p className="text-[9px] text-[#3d5166] font-bold tracking-[0.25em] uppercase text-center">
                    With all my love
                </p>
                <p className="text-center font-bold text-xl text-[#ff6b9d] mt-1">Romeo</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full mt-4 rounded-2xl overflow-hidden border border-pink-heart/20 bg-zinc-900/90 backdrop-blur"
            >
                <div className="relative h-24 w-full">
                    <Image src={PHOTOS.candle} alt="" fill className="object-cover opacity-60" unoptimized />
                    <div className="absolute inset-0 bg-black/50 flex items-center px-3 gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-heart/90 flex items-center justify-center shrink-0">
                            <Music2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-white">Perfect — Ed Sheeran</p>
                            <motion.div
                                className="flex gap-0.5 mt-1.5 h-3 items-end"
                                initial="hidden"
                                animate="visible"
                            >
                                {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
                                    <motion.span
                                        key={i}
                                        className="w-1 bg-pink-heart rounded-full"
                                        animate={{ height: [4, h * 2, 4] }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.08,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/** Slide 4 — Animated polaroid stack */
function SlideMemories() {
    const polaroids = [
        { src: PHOTOS.wedding, rotate: -8, top: "6%", left: "4%", z: 10 },
        { src: PHOTOS.hands, rotate: 5, top: "26%", left: "36%", z: 20 },
        { src: PHOTOS.sunsetWalk, rotate: -4, top: "50%", left: "8%", z: 30 },
    ];

    return (
        <div className="flex flex-col w-full h-full min-h-[560px] pt-9 px-2 pb-6 bg-black">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-3"
            >
                <Sparkles className="w-5 h-5 text-pink-heart mx-auto mb-1" />
                <h2 className="text-base font-bold text-white">Our Memories</h2>
                <p className="text-[9px] text-gray-500">Swipe through our story ♥</p>
            </motion.div>
            <div className="relative flex-1 min-h-[360px]">
                {polaroids.map((p, i) => (
                    <motion.div
                        key={p.src}
                        initial={{ opacity: 0, y: 30, rotate: p.rotate - 10 }}
                        animate={{
                            opacity: 1,
                            y: [0, -4, 0],
                            rotate: p.rotate,
                        }}
                        transition={{
                            opacity: { delay: i * 0.1, duration: 0.5 },
                            y: { duration: 3, repeat: Infinity, delay: i * 0.3 },
                            rotate: { delay: i * 0.1 },
                        }}
                        className="absolute w-[56%] bg-white p-1.5 pb-7 rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                        style={{ top: p.top, left: p.left, zIndex: p.z }}
                    >
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <Image src={p.src} alt="" fill className="object-cover" sizes="160px" unoptimized />
                        </div>
                        <p className="absolute bottom-1.5 left-0 right-0 text-center text-[7px] text-gray-500">
                            forever us ♥
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/** Slide 5 — Hero + mini gallery */
function SlideGallery() {
    return (
        <div className="flex flex-col w-full h-full min-h-[560px] pt-9 px-3 pb-5 bg-black">
            <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center text-[9px] uppercase tracking-[0.3em] text-pink-heart"
            >
                To my sunshine
            </motion.p>
            <h2 className="text-center text-xl font-bold text-[#ff6b9d] mb-3">Maya</h2>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full aspect-[4/5] rounded-[1.85rem] overflow-hidden border-2 border-pink-heart/50 shadow-[0_0_40px_rgba(255,107,157,0.4)] mb-2.5"
            >
                <KenBurnsPhoto src={PHOTOS.ring} alt="Love" zoom={1.14} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent z-10" />
                <p className="absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] text-white font-serif italic px-3">
                    You make every day feel like magic ✨
                </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-2">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/20"
                >
                    <Image src={PHOTOS.roses} alt="" fill className="object-cover" sizes="140px" unoptimized />
                </motion.div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-pink-heart/40 shadow-lg shadow-pink-heart/20">
                    <KenBurnsPhoto src={PHOTOS.embrace} alt="" zoom={1.1} />
                </div>
            </div>
        </div>
    );
}

/** Slide 6 — Golden hour full screen */
function SlideGolden() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <KenBurnsPhoto src={PHOTOS.sunsetWalk} alt="Sunset walk" zoom={1.2} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-amber-900/20 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 px-5 text-center">
                <GlowingHeart className="w-11 h-11" />
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-white mt-4 drop-shadow-lg"
                >
                    Forever Yours
                </motion.h2>
                <p className="text-xs text-amber-100/90 mt-2 font-serif italic max-w-[200px]">
                    Under every sunset, I choose you again
                </p>
                <p className="mt-5 text-[#ff6b9d] font-serif text-lg">Amara & Leo</p>
            </div>
        </div>
    );
}

const SLIDES = [
    SlideJuliet,
    SlideCinematic,
    SlideRomeo,
    SlideMemories,
    SlideGallery,
    SlideGolden,
];

export default function AnimatedMockup() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDE_COUNT);
        }, ROTATE_MS);
        return () => clearInterval(timer);
    }, []);

    const ActiveSlide = SLIDES[currentIndex];

    return (
        <div className="relative mx-auto">
            {/* Outer glow behind phone */}
            <motion.div
                className="absolute -inset-4 rounded-[3rem] bg-pink-heart/20 blur-3xl -z-10"
                animate={{ opacity: [0.35, 0.55, 0.35], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative border-gray-800 bg-black border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-[0_25px_80px_rgba(255,107,157,0.25)] flex flex-col overflow-hidden"
            >
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg" />
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg" />
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg" />
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg" />

                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-black relative">
                    <FloatingPhoneHearts />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
                            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 overflow-hidden"
                        >
                            <ActiveSlide />
                        </motion.div>
                    </AnimatePresence>

                    {/* Status bar shimmer */}
                    <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-black/80 to-transparent z-30 pointer-events-none" />

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Slide ${i + 1}`}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex
                                        ? "w-5 bg-pink-heart shadow-[0_0_8px_rgba(255,107,157,0.8)]"
                                        : "w-1.5 bg-white/35 hover:bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
