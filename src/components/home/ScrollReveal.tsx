"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right";
};

export default function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px -8% 0px" });

    const offset =
        direction === "left"
            ? { x: -48, y: 24 }
            : direction === "right"
              ? { x: 48, y: 24 }
              : { x: 0, y: 48 };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...offset }}
            animate={
                inView
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 0, ...offset }
            }
            transition={{
                duration: 0.75,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
