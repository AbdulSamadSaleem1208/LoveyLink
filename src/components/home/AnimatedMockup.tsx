"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music2 } from "lucide-react";

const ROTATE_MS = 5000;

/** Relationship & love couples only — /public/mockup/love-*.jpg */
const LOVE = {
    sunsetCouple: "/mockup/love-01.jpg",
    soulmates: "/mockup/love-02.jpg",
    embrace: "/mockup/love-03.jpg",
    wedding: "/mockup/love-04.jpg",
    kiss: "/mockup/love-05.jpg",
    inLove: "/mockup/love-06.jpg",
    holding: "/mockup/love-07.jpg",
    happy: "/mockup/love-08.jpg",
} as const;

const FALLBACK = LOVE.sunsetCouple;

function LoveImg({
    src,
    alt,
    className = "absolute inset-0 h-full w-full object-cover",
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [url, setUrl] = useState(src);
    useEffect(() => setUrl(src), [src]);
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={url}
            alt={alt}
            className={className}
            loading="eager"
            decoding="async"
            onError={() => url !== FALLBACK && setUrl(FALLBACK)}
        />
    );
}

function LoveKenBurns({ src, alt, zoom = 1.12 }: { src: string; alt: string; zoom?: number }) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute inset-0 h-full w-full origin-center"
                initial={{ scale: 1 }}
                animate={{ scale: zoom }}
                transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
            >
                <LoveImg src={src} alt={alt} />
            </motion.div>
        </div>
    );
}

function GlowHeart({ size = "w-14 h-14" }: { size?: string }) {
    return (
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <Heart className={`${size} text-pink-heart fill-pink-heart drop-shadow-[0_0_18px_rgba(255,107,157,0.85)]`} />
        </motion.div>
    );
}

function FloatingHearts() {
    return (
        <>
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                    key={i}
                    className="absolute text-pink-heart/25 pointer-events-none z-[5]"
                    style={{ left: `${12 + i * 17}%`, bottom: `${10 + (i % 3) * 10}%` }}
                    animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
                    transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
                >
                    <Heart className="w-3 h-3 fill-current" />
                </motion.span>
            ))}
        </>
    );
}

/* ——— 8 relationship-only slides ——— */

function SlideForMyLove() {
    return (
        <div className="flex flex-col items-center w-full h-full min-h-[560px] pt-11 px-4 pb-2 bg-black">
            <GlowHeart />
            <h2 className="font-bold text-[1.65rem] text-[#ff6b9d] mt-4">For My Love</h2>
            <p className="text-gray-400 text-xs mt-1">In a relationship with you ♥</p>
            <p className="font-serif text-[1.6rem] text-[#ff6b9d] mt-1">Juliet</p>
            <div className="w-full flex-1 min-h-[270px] mt-4 rounded-t-[2.25rem] overflow-hidden border-2 border-white/90 relative">
                <LoveKenBurns src={LOVE.sunsetCouple} alt="Couple in love at sunset" zoom={1.14} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent z-10" />
                <p className="absolute bottom-3 inset-x-0 text-center text-[10px] text-white/85 z-20 tracking-widest uppercase">
                    Our relationship
                </p>
            </div>
        </div>
    );
}

function SlideInLove() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <LoveKenBurns src={LOVE.soulmates} alt="Couple soulmates in love" zoom={1.16} />
            <div className="absolute inset-0 bg-gradient-to-b from-pink-900/25 to-black/80 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <Sparkles className="w-7 h-7 text-pink-heart mb-3" />
                <h2 className="text-2xl font-bold text-white">In Love</h2>
                <p className="text-sm text-pink-100/90 mt-2 font-serif italic">
                    Two hearts, one relationship
                </p>
            </div>
        </div>
    );
}

function SlideLoveLetter() {
    return (
        <div className="flex flex-col w-full min-h-full px-4 py-10 pb-16 justify-center bg-black">
            <div className="bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-3xl p-5 ring-1 ring-white/20 shadow-2xl">
                <p className="font-serif italic text-[#1a2634] text-[13px] text-center leading-relaxed">
                    &ldquo;Being in love with you is the best part of my life. You are my person, my
                    relationship, my forever.&rdquo; <span className="text-[#ff6b9d]">♥</span>
                </p>
                <div className="h-px bg-white/45 my-4" />
                <p className="text-[9px] text-center tracking-[0.2em] uppercase text-[#3d5166] font-bold">
                    With love
                </p>
                <p className="text-center text-xl font-bold text-[#ff6b9d]">Romeo</p>
            </div>
            <div className="relative h-28 mt-4 rounded-2xl overflow-hidden border border-pink-heart/25">
                <LoveImg src={LOVE.embrace} alt="Couple hugging in love" />
                <div className="absolute inset-0 bg-black/40 flex items-center gap-3 px-3">
                    <div className="w-9 h-9 rounded-full bg-pink-heart flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Our relationship playlist ♥</p>
                </div>
            </div>
        </div>
    );
}

function SlideOurRelationship() {
    const pics = [
        { src: LOVE.wedding, tag: "in love" },
        { src: LOVE.holding, tag: "together" },
        { src: LOVE.kiss, tag: "forever" },
    ];
    return (
        <div className="w-full h-full min-h-[560px] pt-9 px-2 pb-6 bg-black">
            <h2 className="text-center text-base font-bold text-white">Our Relationship</h2>
            <p className="text-center text-[9px] text-gray-500 mb-3">Loves &amp; memories ♥</p>
            <div className="relative flex-1 min-h-[360px]">
                {pics.map((p, i) => (
                    <motion.div
                        key={p.src}
                        className="absolute w-[55%] bg-white p-1.5 pb-6 rounded-sm shadow-xl"
                        style={{
                            top: `${6 + i * 22}%`,
                            left: i === 1 ? "38%" : "5%",
                            zIndex: 10 + i,
                            rotate: i === 0 ? -7 : i === 1 ? 5 : -3,
                        }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
                    >
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <LoveImg src={p.src} alt="Couple in love" />
                        </div>
                        <p className="text-[7px] text-center text-gray-500 mt-1">{p.tag} ♥</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function SlideMyGirlfriend() {
    return (
        <div className="w-full h-full min-h-[560px] pt-9 px-3 pb-5 bg-black">
            <p className="text-center text-[9px] uppercase tracking-[0.25em] text-pink-heart">
                My relationship
            </p>
            <h2 className="text-center text-xl font-bold text-[#ff6b9d] mb-3">Maya</h2>
            <div className="relative w-full aspect-[4/5] rounded-[1.8rem] overflow-hidden border-2 border-pink-heart/45 mb-2">
                <LoveKenBurns src={LOVE.inLove} alt="Girlfriend and boyfriend in love" zoom={1.13} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 z-10" />
                <p className="absolute bottom-4 inset-x-0 z-20 text-center text-[11px] text-white font-serif italic">
                    I love being in this relationship with you
                </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15">
                    <LoveImg src={LOVE.happy} alt="Happy couple in love" />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-pink-heart/35">
                    <LoveKenBurns src={LOVE.embrace} alt="Loving embrace" zoom={1.08} />
                </div>
            </div>
        </div>
    );
}

function SlideForeverLove() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <LoveKenBurns src={LOVE.soulmates} alt="Couple in love forever" zoom={1.18} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-center px-5">
                <GlowHeart size="w-11 h-11" />
                <h2 className="text-2xl font-bold text-white mt-3">Forever In Love</h2>
                <p className="text-xs text-pink-100/90 mt-2 font-serif italic">
                    This relationship is my greatest love
                </p>
            </div>
        </div>
    );
}

function SlideTrueLove() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <LoveKenBurns src={LOVE.kiss} alt="Couple kiss true love" zoom={1.1} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-pink-900/20 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <Heart className="w-11 h-11 text-pink-heart fill-pink-heart mb-3" />
                <h2 className="text-2xl font-bold text-white">True Love</h2>
                <p className="text-sm text-pink-100/90 mt-2 font-serif italic">
                    Soulmates in every lifetime
                </p>
            </div>
        </div>
    );
}

function SlideSoulmates() {
    const thumbs = [LOVE.holding, LOVE.happy, LOVE.sunsetCouple];
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <LoveKenBurns src={LOVE.inLove} alt="Soulmate couple" zoom={1.12} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 z-10" />
            <div className="absolute top-14 inset-x-0 z-20 text-center px-4">
                <h2 className="text-2xl font-bold text-white">Soulmates</h2>
                <p className="text-sm text-pink-200/90 mt-2 font-serif italic">
                    Our love, our relationship, our story
                </p>
            </div>
            <div className="absolute bottom-10 inset-x-0 flex justify-center gap-2.5 z-20">
                {thumbs.map((src) => (
                    <div
                        key={src}
                        className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/35"
                    >
                        <LoveImg src={src} alt="Love" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const SLIDES = [
    SlideForMyLove,
    SlideInLove,
    SlideLoveLetter,
    SlideOurRelationship,
    SlideMyGirlfriend,
    SlideForeverLove,
    SlideTrueLove,
    SlideSoulmates,
];

export default function AnimatedMockup() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
        return () => clearInterval(t);
    }, []);

    const Slide = SLIDES[index];

    return (
        <div className="relative mx-auto">
            <motion.div
                className="absolute -inset-4 rounded-[3rem] bg-pink-heart/20 blur-3xl -z-10"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative border-[14px] border-gray-800 bg-black rounded-[2.5rem] h-[600px] w-[300px] shadow-[0_20px_70px_rgba(255,107,157,0.22)] overflow-hidden"
            >
                <div className="rounded-[2rem] h-full w-full relative overflow-hidden">
                    <FloatingHearts />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, filter: "blur(6px)" }}
                            animate={{ opacity: 1, filter: "blur(0)" }}
                            exit={{ opacity: 0, filter: "blur(4px)" }}
                            transition={{ duration: 0.55 }}
                            className="absolute inset-0"
                        >
                            <Slide />
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-30">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Love slide ${i + 1}`}
                                onClick={() => setIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === index ? "w-5 bg-pink-heart" : "w-1.5 bg-white/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
