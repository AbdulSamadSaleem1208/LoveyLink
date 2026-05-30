"use client";

import { motion } from "framer-motion";

export default function PromoBanner() {
    return (
        <div className="relative z-30 overflow-hidden border-b border-pink-heart/20 bg-gradient-to-r from-zinc-950 via-[#1a1014] to-zinc-950 py-2.5 text-center text-sm backdrop-blur-md">
            <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-pink-heart/12 to-transparent"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                aria-hidden
            />
            <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative text-gray-300 font-medium tracking-wide"
            >
                <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="inline-block text-pink-heart mr-1.5"
                >
                    ✨
                </motion.span>
                <span className="text-pink-light/90">Premium love pages</span>
                <span className="text-gray-500 mx-1.5">—</span>
                <span className="text-white font-semibold">50% off</span>
                <span className="text-gray-400 ml-1">today</span>
            </motion.p>
        </div>
    );
}
