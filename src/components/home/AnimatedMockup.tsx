"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Music2 } from "lucide-react";

const ROTATE_MS = 5000;
const IMG_VER = "4";

/** Man & woman in love — couple relationship photos (Pexels, bundled locally) */
const RELATIONSHIP = {
    coupleBeach: `/mockup/relationship-01.jpg?v=${IMG_VER}`,
    coupleHug: `/mockup/relationship-02.jpg?v=${IMG_VER}`,
    coupleKiss: `/mockup/relationship-03.jpg?v=${IMG_VER}`,
    coupleRomantic: `/mockup/relationship-04.jpg?v=${IMG_VER}`,
    coupleHands: `/mockup/relationship-05.jpg?v=${IMG_VER}`,
    coupleHappy: `/mockup/relationship-06.jpg?v=${IMG_VER}`,
    coupleWalk: `/mockup/relationship-07.jpg?v=${IMG_VER}`,
    coupleWedding: `/mockup/relationship-08.jpg?v=${IMG_VER}`,
} as const;

const FALLBACK = RELATIONSHIP.coupleBeach;

function CouplePhoto({
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

function KenBurns({
    src,
    alt,
    zoom = 1.12,
}: {
    src: string;
    alt: string;
    zoom?: number;
}) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute inset-0 h-full w-full origin-center"
                initial={{ scale: 1 }}
                animate={{ scale: zoom }}
                transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
            >
                <CouplePhoto src={src} alt={alt} />
            </motion.div>
        </div>
    );
}

function GlowHeart({ size = "w-14 h-14" }: { size?: string }) {
    return (
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <Heart
                className={`${size} text-rose-300/70 fill-rose-300/70 drop-shadow-[0_0_12px_rgba(201,163,177,0.35)]`}
            />
        </motion.div>
    );
}

function FloatingHearts() {
    return (
        <>
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                    key={i}
                    className="absolute text-rose-300/20 pointer-events-none z-[5]"
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

function SlideOurRelationshipHero() {
    return (
        <div className="flex flex-col items-center w-full h-full min-h-[560px] pt-10 px-4 pb-2 bg-black">
            <GlowHeart />
            <h2 className="font-bold text-[1.55rem] text-rose-200/90 mt-3 text-center">
                Our Relationship
            </h2>
            <p className="text-gray-400 text-xs mt-1 text-center">Couple in love ♥</p>
            <p className="font-serif text-[1.5rem] text-rose-200/85 mt-1">Juliet &amp; Romeo</p>
            <div className="w-full flex-1 min-h-[265px] mt-3 rounded-t-[2.25rem] overflow-hidden border-2 border-white/90 relative">
                <KenBurns src={RELATIONSHIP.coupleBeach} alt="Man and woman couple in love on beach" zoom={1.14} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent z-10" />
                <p className="absolute bottom-3 inset-x-0 text-center text-[10px] text-white/85 z-20 tracking-widest uppercase">
                    In love forever
                </p>
            </div>
        </div>
    );
}

function SlideInLove() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <KenBurns src={RELATIONSHIP.coupleRomantic} alt="Man and woman romantic couple" zoom={1.15} />
            <div className="absolute inset-0 bg-gradient-to-b from-rose-950/25 to-black/85 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <Sparkles className="w-7 h-7 text-rose-300/70 mb-3" />
                <h2 className="text-2xl font-bold text-white">In Love</h2>
                <p className="text-sm text-gray-300 mt-2 font-serif italic">
                    Boyfriend &amp; girlfriend — one relationship
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
                    &ldquo;Our relationship is my favorite love story. Every day I fall in love with
                    you again.&rdquo; <span className="text-rose-400/80">♥</span>
                </p>
                <div className="h-px bg-white/45 my-4" />
                <p className="text-[9px] text-center tracking-[0.2em] uppercase text-[#3d5166] font-bold">
                    Your partner
                </p>
                <p className="text-center text-xl font-bold text-rose-300/80">With all my love</p>
            </div>
            <div className="relative h-32 mt-4 rounded-2xl overflow-hidden border border-white/15">
                <CouplePhoto src={RELATIONSHIP.coupleHug} alt="Man and woman hugging in love" />
                <div className="absolute inset-0 bg-black/35 flex items-center gap-3 px-3">
                    <div className="w-9 h-9 rounded-full bg-rose-800/60 flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Our relationship song ♥</p>
                </div>
            </div>
        </div>
    );
}

function SlideRelationshipMemories() {
    const pics = [
        { src: RELATIONSHIP.coupleWedding, tag: "our wedding" },
        { src: RELATIONSHIP.coupleHands, tag: "holding hands" },
        { src: RELATIONSHIP.coupleKiss, tag: "in love" },
    ];
    return (
        <div className="w-full h-full min-h-[560px] pt-9 px-2 pb-6 bg-black">
            <h2 className="text-center text-base font-bold text-white">Our Relationship</h2>
            <p className="text-center text-[9px] text-rose-300/50 mb-3">Man &amp; woman in love ♥</p>
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
                            <CouplePhoto src={p.src} alt="Couple in a relationship" />
                        </div>
                        <p className="text-[7px] text-center text-gray-500 mt-1">{p.tag} ♥</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function SlideCoupleLove() {
    return (
        <div className="w-full h-full min-h-[560px] pt-9 px-3 pb-5 bg-black">
            <p className="text-center text-[9px] uppercase tracking-[0.25em] text-rose-300/50">
                Our relationship
            </p>
            <h2 className="text-center text-xl font-bold text-rose-200/90 mb-3">My Love</h2>
            <div className="relative w-full aspect-[4/5] rounded-[1.8rem] overflow-hidden border-2 border-white/20 mb-2">
                <KenBurns src={RELATIONSHIP.coupleHappy} alt="Happy man and woman in love" zoom={1.13} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 z-10" />
                <p className="absolute bottom-4 inset-x-0 z-20 text-center text-[11px] text-white font-serif italic px-2">
                    Two people, one beautiful relationship
                </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15">
                    <CouplePhoto src={RELATIONSHIP.coupleWalk} alt="Couple walking together" />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15">
                    <KenBurns src={RELATIONSHIP.coupleHug} alt="Couple embrace" zoom={1.08} />
                </div>
            </div>
        </div>
    );
}

function SlideForeverTogether() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <KenBurns src={RELATIONSHIP.coupleWalk} alt="Couple walking in love" zoom={1.18} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12 text-center px-5">
                <GlowHeart size="w-11 h-11" />
                <h2 className="text-2xl font-bold text-white mt-3">Forever Together</h2>
                <p className="text-xs text-gray-300 mt-2 font-serif italic">
                    Our relationship, our love, our life
                </p>
            </div>
        </div>
    );
}

function SlideTrueLoveKiss() {
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <KenBurns src={RELATIONSHIP.coupleKiss} alt="Man and woman kissing" zoom={1.1} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-rose-950/15 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <Heart className="w-11 h-11 text-rose-300/70 fill-rose-300/70 mb-3" />
                <h2 className="text-2xl font-bold text-white">True Love</h2>
                <p className="text-sm text-gray-300 mt-2 font-serif italic">
                    A real relationship, real love
                </p>
            </div>
        </div>
    );
}

function SlideSoulmates() {
    const thumbs = [
        RELATIONSHIP.coupleHands,
        RELATIONSHIP.coupleHappy,
        RELATIONSHIP.coupleBeach,
    ];
    return (
        <div className="relative w-full h-full min-h-[560px]">
            <KenBurns src={RELATIONSHIP.coupleWedding} alt="Man and woman couple in love" zoom={1.12} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/85 z-10" />
            <div className="absolute top-14 inset-x-0 z-20 text-center px-4">
                <h2 className="text-2xl font-bold text-white">Soulmates</h2>
                <p className="text-sm text-gray-300 mt-2 font-serif italic">
                    Our relationship is built on love
                </p>
            </div>
            <div className="absolute bottom-10 inset-x-0 flex justify-center gap-2.5 z-20">
                {thumbs.map((src) => (
                    <div
                        key={src}
                        className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/35"
                    >
                        <CouplePhoto src={src} alt="Couple relationship" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const SLIDES = [
    SlideOurRelationshipHero,
    SlideInLove,
    SlideLoveLetter,
    SlideRelationshipMemories,
    SlideCoupleLove,
    SlideForeverTogether,
    SlideTrueLoveKiss,
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
                className="absolute -inset-4 rounded-[3rem] bg-rose-900/15 blur-3xl -z-10"
                animate={{ opacity: [0.15, 0.28, 0.15] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative border-[14px] border-gray-800 bg-black rounded-[2.5rem] h-[min(600px,78vh)] w-[min(300px,92vw)] max-w-full shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden mx-auto"
            >
                <div className="rounded-[2rem] h-full w-full relative overflow-hidden bg-black">
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
                                aria-label={`Our relationship slide ${i + 1}`}
                                onClick={() => setIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === index ? "w-5 bg-rose-300/60" : "w-1.5 bg-white/25"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
