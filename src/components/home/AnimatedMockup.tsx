"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const SLIDE_COUNT = 5;
const ROTATE_MS = 4800;

const PHOTOS = {
    hands: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop",
    sunset: "https://images.unsplash.com/photo-1518199265581-640bb5e88697?q=80&w=800&auto=format&fit=crop",
    embrace: "https://images.unsplash.com/photo-1516589178581-6cd08396b0a7?q=80&w=800&auto=format&fit=crop",
    roses: "https://images.unsplash.com/photo-1518895949254-959df862fbf0?q=80&w=600&auto=format&fit=crop",
    walk: "https://images.unsplash.com/photo-1522673607218-f9a9b6775f0c?q=80&w=800&auto=format&fit=crop",
    ring: "https://images.unsplash.com/photo-1523438883736-0a952c96e34b?q=80&w=800&auto=format&fit=crop",
} as const;

function SlideJuliet() {
    return (
        <div className="flex flex-col items-center w-full min-h-full pt-12 px-4 pb-4">
            <Heart className="w-14 h-14 text-pink-heart fill-pink-heart mb-4 drop-shadow-[0_0_12px_rgba(255,107,157,0.5)]" />
            <h2 className="font-bold text-2xl text-[#ff6b9d] mb-3 tracking-tight">For my love</h2>
            <div className="text-center mb-5">
                <p className="text-gray-400 text-xs mb-0.5">To my dearest,</p>
                <h3 className="font-serif text-2xl text-[#ff6b9d]">Juliet</h3>
            </div>
            <div className="w-full flex-1 min-h-[220px] rounded-t-[2rem] overflow-hidden border-2 border-white/80 shadow-[0_0_40px_rgba(255,107,157,0.25)] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-pink-500/10 z-10 pointer-events-none" />
                <Image
                    src={PHOTOS.hands}
                    alt="Romantic couple"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                    unoptimized
                />
            </div>
        </div>
    );
}

function SlideRomeo() {
    return (
        <div className="flex flex-col items-center w-full min-h-full px-4 py-10 pb-16 justify-center">
            <div className="bg-gradient-to-br from-[#b8b8b8] to-[#8a8a8a] rounded-3xl p-5 w-full shadow-2xl flex flex-col mb-4 ring-1 ring-white/20">
                <p className="font-serif italic text-[#1e2a36] text-[13px] leading-relaxed text-center font-medium">
                    &ldquo;Every moment with you feels like a beautiful dream I never want to wake up from.
                    Your smile lights up the darkest days… my heart always chooses you.&rdquo;{" "}
                    <span className="text-pink-heart">♥</span>
                </p>
                <div className="w-full h-px bg-white/40 my-4" />
                <div className="text-center">
                    <p className="text-[9px] text-[#4a5f73] font-bold tracking-[0.2em] uppercase mb-1">
                        With all my love
                    </p>
                    <h3 className="font-bold text-xl text-[#ff6b9d] tracking-tight">Romeo</h3>
                </div>
            </div>
            <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-lg opacity-90">
                <div className="bg-[#1a1a1a] px-3 py-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-green-600/80 flex items-center justify-center text-[10px]">♪</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white truncate font-medium">Our Song</p>
                        <p className="text-[9px] text-gray-500">Playing now</p>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-[9px] text-gray-500 flex items-center gap-1">
                Created with <Heart className="w-2.5 h-2.5 text-pink-heart fill-pink-heart" /> LoveyLink
            </p>
        </div>
    );
}

function SlideMemories() {
    const polaroids = [
        { src: PHOTOS.sunset, rotate: -6, top: "8%", left: "6%", z: 10 },
        { src: PHOTOS.walk, rotate: 4, top: "28%", left: "38%", z: 20 },
        { src: PHOTOS.embrace, rotate: -3, top: "52%", left: "12%", z: 30 },
    ];

    return (
        <div className="flex flex-col w-full min-h-full pt-10 px-3 pb-6 bg-gradient-to-b from-black via-zinc-950 to-black">
            <div className="text-center mb-4 px-2">
                <Sparkles className="w-5 h-5 text-pink-heart mx-auto mb-2" />
                <h2 className="text-lg font-bold text-white">Our Memories</h2>
                <p className="text-[10px] text-gray-400 mt-1">Every picture tells our story</p>
            </div>
            <div className="relative flex-1 min-h-[340px] mx-1">
                {polaroids.map((p, i) => (
                    <motion.div
                        key={p.src}
                        initial={{ opacity: 0, y: 16, rotate: p.rotate }}
                        animate={{ opacity: 1, y: 0, rotate: p.rotate }}
                        transition={{ delay: i * 0.12, duration: 0.5 }}
                        className="absolute w-[58%] bg-white p-1.5 pb-8 rounded-sm shadow-2xl"
                        style={{ top: p.top, left: p.left, zIndex: p.z }}
                    >
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <Image
                                src={p.src}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="180px"
                                unoptimized
                            />
                        </div>
                        <p className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-gray-600 font-handwriting">
                            us ♥
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function SlideForever() {
    return (
        <div className="relative w-full min-h-full flex flex-col">
            <div className="absolute inset-0">
                <Image
                    src={PHOTOS.embrace}
                    alt="Couple at sunset"
                    fill
                    className="object-cover"
                    sizes="300px"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-pink-900/30" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-end flex-1 px-5 pb-10 pt-16 text-center">
                <Heart className="w-10 h-10 text-pink-heart fill-pink-heart mb-3 animate-pulse" />
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Forever Yours</h2>
                <p className="text-sm text-pink-200/90 mt-2 font-serif italic max-w-[220px]">
                    Under every sky, in every lifetime — it&apos;s always you.
                </p>
                <p className="mt-6 text-[#ff6b9d] font-serif text-xl">Amara &amp; Leo</p>
            </div>
        </div>
    );
}

function SlideGallery() {
    return (
        <div className="flex flex-col w-full min-h-full pt-10 px-3 pb-4 bg-black">
            <p className="text-center text-[10px] uppercase tracking-widest text-pink-heart/80 mb-1">
                To my sunshine
            </p>
            <h2 className="text-center text-xl font-bold text-[#ff6b9d] mb-4">Maya</h2>

            <div className="relative w-full aspect-[4/5] rounded-[1.75rem] overflow-hidden border-2 border-pink-heart/40 shadow-[0_0_30px_rgba(255,107,157,0.35)] mb-3">
                <Image
                    src={PHOTOS.ring}
                    alt="Couple"
                    fill
                    className="object-cover"
                    sizes="280px"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/90 font-serif italic px-4">
                    You make ordinary days feel like magic ✨
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15">
                    <Image src={PHOTOS.roses} alt="" fill className="object-cover" sizes="140px" unoptimized />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-pink-heart/30 ring-1 ring-pink-heart/20">
                    <Image src={PHOTOS.sunset} alt="" fill className="object-cover saturate-125" sizes="140px" unoptimized />
                </div>
            </div>
        </div>
    );
}

const SLIDES = [SlideJuliet, SlideRomeo, SlideMemories, SlideForever, SlideGallery];

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
        <div className="relative mx-auto border-gray-800 bg-black border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden">
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg" />
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg" />
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg" />
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg" />

            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-black relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.55, ease: "easeInOut" }}
                        className="w-full h-full overflow-y-auto scrollbar-hide"
                    >
                        <ActiveSlide />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                    {SLIDES.map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === currentIndex
                                    ? "w-4 bg-pink-heart"
                                    : "w-1.5 bg-white/30"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
