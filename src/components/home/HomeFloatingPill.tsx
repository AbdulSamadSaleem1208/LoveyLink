"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
    delay?: number;
    float?: boolean;
};

export default function HomeFloatingPill({
    children,
    className = "",
    delay = 0,
    float = true,
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
                opacity: 1,
                scale: 1,
                ...(float ? { y: [0, -5, 0] } : {}),
            }}
            transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: float ? { duration: 4, repeat: Infinity, ease: "easeInOut", delay } : undefined,
            }}
            whileHover={{ scale: 1.04, borderColor: "rgba(255, 107, 157, 0.45)" }}
            className={`rounded-xl border border-pink-heart/25 bg-gradient-to-br from-pink-heart/10 to-zinc-900/90 px-4 py-2.5 text-xs text-gray-200 shadow-lg shadow-pink-heart/10 backdrop-blur-md ${className}`}
        >
            {children}
        </motion.div>
    );
}
