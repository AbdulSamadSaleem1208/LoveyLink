"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Share2, QrCode, Star, ChevronRight } from "lucide-react";
import AnimatedMockup from "@/components/home/AnimatedMockup";
import ScrollReveal from "@/components/home/ScrollReveal";
import PromoBanner from "@/components/home/PromoBanner";
import HomeFloatingPill from "@/components/home/HomeFloatingPill";

type Props = {
    isLoggedIn: boolean;
};

export default function HomePageContent({ isLoggedIn }: Props) {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-sans">
            <PromoBanner />

            <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <motion.div
                        className="absolute top-20 left-10 text-pink-heart/90"
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Heart size={40} className="fill-current" />
                    </motion.div>
                    <motion.div
                        className="absolute top-40 right-20 text-pink-heart/75"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3.5, repeat: Infinity }}
                    >
                        <Heart size={60} className="fill-current" />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-20 left-1/4 text-pink-heart/65"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        <Heart size={30} className="fill-current" />
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                        <ScrollReveal className="flex-1 space-y-8" direction="left">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="inline-flex items-center px-4 py-2 rounded-full border border-pink-heart/35 bg-pink-heart/10 text-pink-light text-sm backdrop-blur-sm shadow-[0_0_20px_rgba(255,107,157,0.15)]"
                            >
                                <Heart className="w-4 h-4 mr-2 text-pink-heart fill-current" />
                                Want to start?
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight selection:bg-pink-heart/40 selection:text-white">
                                Declare your love <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b9d] via-[#ff8fab] to-[#ffc2d4] drop-shadow-sm">
                                    for someone special!
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Create a personalized page for who you love and surprise that
                                person with a special declaration that will last forever.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        href={isLoggedIn ? "/dashboard" : "/register"}
                                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-button-gradient hover:opacity-90 shadow-lg shadow-pink-heart/25 transition-all"
                                    >
                                        <Heart className="w-5 h-5 mr-3 heart-white fill-current" />
                                        {isLoggedIn ? "Go to Dashboard" : "Create my page"}
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </motion.div>
                            </div>

                            <motion.div
                                whileHover={{ borderColor: "rgba(255, 107, 157, 0.35)" }}
                                className="bg-background-card/50 backdrop-blur-md p-4 rounded-xl border border-white/10 inline-block text-left mt-8 max-w-sm transition-colors"
                            >
                                <div className="flex text-yellow-400 mb-1">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm font-medium text-gray-300">
                                    Loved by couples worldwide
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Join 10,000+ happy couples
                                </p>
                            </motion.div>
                        </ScrollReveal>

                        <ScrollReveal
                            className="flex-1 relative flex justify-center lg:justify-end min-h-[520px]"
                            direction="right"
                            delay={0.15}
                        >
                            <HomeFloatingPill
                                className="absolute -left-10 top-1/4 z-20 hidden md:block"
                                delay={0.3}
                            >
                                <span className="text-pink-heart">♥</span> Live love pages
                            </HomeFloatingPill>
                            <HomeFloatingPill
                                className="absolute -right-5 top-1/3 z-20 hidden md:block"
                                delay={0.5}
                            >
                                Animated & beautiful{" "}
                                <span className="text-pink-heart">♥</span>
                            </HomeFloatingPill>
                            <HomeFloatingPill
                                className="absolute -right-2 bottom-1/4 z-20 hidden md:block max-w-[11rem] text-center"
                                delay={0.7}
                                float
                            >
                                <span className="text-pink-light/90">Our relationship</span>
                                <span className="text-gray-400"> — couple love pages</span>
                            </HomeFloatingPill>
                            <AnimatedMockup />
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section
                id="how-it-works"
                className="py-24 bg-background-card border-t border-pink-heart/10 relative overflow-hidden"
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,107,157,0.14) 0%, transparent 60%)",
                    }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal className="text-center mb-16">
                        <motion.p
                            className="text-pink-heart font-bold tracking-wide uppercase text-sm mb-2"
                            animate={{ opacity: [0.85, 1, 0.85] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            How it works
                        </motion.p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Create your surprise in 3 steps
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            delay={0.1}
                            icon={<Star className="h-8 w-8 text-pink-heart" />}
                            title="1. Customize"
                            description="Choose your colors, photos, and write a message from your heart."
                        />
                        <FeatureCard
                            delay={0.25}
                            icon={<QrCode className="h-8 w-8 text-pink-heart" />}
                            title="2. Generate QR"
                            description="Get a unique QR code automatically created for your page."
                        />
                        <FeatureCard
                            delay={0.4}
                            icon={<Share2 className="h-8 w-8 text-pink-heart" />}
                            title="3. Surprise!"
                            description="Share the link or print the QR code to surprise your love."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
    delay = 0,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
}) {
    return (
        <ScrollReveal delay={delay}>
            <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-8 bg-black/50 rounded-2xl border border-white/10 hover:border-pink-heart/40 hover:shadow-xl hover:shadow-pink-heart/15 transition-colors duration-300 group h-full"
            >
                <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 p-4 bg-pink-heart/10 rounded-xl inline-block border border-pink-heart/15 group-hover:bg-pink-heart/18 group-hover:border-pink-heart/30 transition-colors"
                >
                    {icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
            </motion.div>
        </ScrollReveal>
    );
}
