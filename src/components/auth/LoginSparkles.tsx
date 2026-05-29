"use client";

import { motion } from "framer-motion";

const SPARKLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 17) % 100}%`,
    top: `${(i * 23 + 5) % 100}%`,
    size: 2 + (i % 3),
    delay: (i % 5) * 0.3,
}));

export default function LoginSparkles() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {SPARKLES.map((s) => (
                <motion.span
                    key={s.id}
                    className="absolute rounded-full bg-pink-heart"
                    style={{
                        left: s.left,
                        top: s.top,
                        width: s.size,
                        height: s.size,
                    }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [1, 1.8, 1],
                    }}
                    transition={{
                        duration: 2.5 + (s.id % 3),
                        repeat: Infinity,
                        delay: s.delay,
                    }}
                />
            ))}
        </div>
    );
}
