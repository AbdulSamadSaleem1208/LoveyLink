"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginWelcomeBurst() {
    const router = useRouter();

    useEffect(() => {
        toast.success("Welcome back! So glad you're here 💗", { duration: 4000 });
        const t = setTimeout(() => {
            router.replace("/dashboard");
        }, 100);
        return () => clearTimeout(t);
    }, [router]);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-pink-heart"
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0.5],
                        y: [0, -120 - i * 15],
                        x: [(i - 6) * 30, (i - 6) * 50],
                    }}
                    transition={{ duration: 1.8, delay: i * 0.08, ease: "easeOut" }}
                >
                    <Heart className="w-8 h-8 fill-current drop-shadow-[0_0_12px_rgba(255,107,157,0.8)]" />
                </motion.div>
            ))}
        </div>
    );
}
