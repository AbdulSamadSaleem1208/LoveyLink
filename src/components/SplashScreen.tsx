"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Hide the splash screen after 2 seconds
        const timer = setTimeout(() => {
            setShow(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black"
                >
                    <div className="flex flex-col items-center">
                        {/* Custom Glowing Heart Logo (Transparent Background) */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.9, 1.1, 0.9],
                                opacity: 1
                            }}
                            transition={{
                                scale: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 0.5 }
                            }}
                            className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40"
                        >
                            {/* Glowing background behind heart */}
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-[40px] opacity-40 animate-pulse"></div>

                            {/* The Heart SVG */}
                            <svg
                                viewBox="0 0 24 24"
                                fill="url(#heart-gradient)"
                                className="w-full h-full relative z-10 drop-shadow-2xl"
                            >
                                <defs>
                                    <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff4d4d" />
                                        <stop offset="50%" stopColor="#ff0066" />
                                        <stop offset="100%" stopColor="#990033" />
                                    </linearGradient>
                                </defs>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </motion.div>
                        {/* Fading Title */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mt-6 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff0066] to-[#ff66b3] tracking-tighter"
                        >
                            LoveyLink
                        </motion.h1>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
