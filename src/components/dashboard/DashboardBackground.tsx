"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function DashboardBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,107,157,0.12)_0%,transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_80%,rgba(219,39,119,0.1)_0%,transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(147,51,234,0.06)_0%,transparent_35%)]" />

            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-pink-heart/20"
                    style={{
                        left: `${10 + i * 15}%`,
                        top: `${8 + (i % 3) * 28}%`,
                    }}
                    animate={{
                        y: [0, -18, 0],
                        opacity: [0.15, 0.35, 0.15],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 5 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                    }}
                >
                    <Heart className="w-6 h-6 fill-current" />
                </motion.div>
            ))}
        </div>
    );
}
