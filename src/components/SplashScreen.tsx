"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
                            <div className="absolute inset-0 bg-pink-500 rounded-full blur-[40px] opacity-40 animate-pulse"></div>
                            <Image
                                src="/logo.png"
                                alt="LoveyLink logo"
                                width={160}
                                height={160}
                                className="relative z-10 w-full h-full rounded-full drop-shadow-2xl"
                                priority
                            />
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
