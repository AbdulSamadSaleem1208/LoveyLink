"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const HEARTS = [
    { size: 28, left: "8%", delay: 0, duration: 14, y: [0, -30, 0] },
    { size: 40, left: "85%", delay: 1.2, duration: 18, y: [0, -45, 0] },
    { size: 22, left: "72%", delay: 0.4, duration: 12, y: [0, -25, 0] },
    { size: 52, left: "18%", delay: 2, duration: 20, y: [0, -55, 0] },
    { size: 18, left: "45%", delay: 0.8, duration: 11, y: [0, -20, 0] },
    { size: 34, left: "92%", delay: 1.8, duration: 16, y: [0, -40, 0] },
    { size: 26, left: "55%", delay: 2.5, duration: 13, y: [0, -35, 0] },
];

type Props = {
    className?: string;
    count?: number;
};

export default function FloatingHearts({ className = "", count = HEARTS.length }: Props) {
    return (
        <div
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
            aria-hidden
        >
            {HEARTS.slice(0, count).map((h, i) => (
                <motion.div
                    key={i}
                    className="absolute bottom-0 text-pink-heart"
                    style={{ left: h.left }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{
                        opacity: [0.15, 0.45, 0.15],
                        y: h.y,
                    }}
                    transition={{
                        duration: h.duration,
                        delay: h.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Heart
                        size={h.size}
                        className="fill-pink-heart text-pink-heart drop-shadow-[0_0_12px_rgba(255,107,157,0.5)]"
                    />
                </motion.div>
            ))}
        </div>
    );
}
