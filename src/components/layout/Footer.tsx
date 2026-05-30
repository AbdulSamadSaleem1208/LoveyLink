"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <footer className="bg-black border-t border-pink-heart/15 text-gray-400 relative overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,107,157,0.08) 0%, transparent 70%)",
                }}
            />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="LoveyLink logo"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full ring-1 ring-pink-heart/30 group-hover:ring-pink-heart/60 group-hover:scale-110 transition-all"
                        />
                        <span className="font-bold text-xl text-white group-hover:text-pink-heart transition-colors">
                            LoveyLink.
                        </span>
                    </Link>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <Link
                            href="/privacy"
                            className="hover:text-pink-light text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-pink-light text-sm transition-colors"
                        >
                            Terms of Use
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:text-pink-light text-sm transition-colors"
                        >
                            Contact
                        </Link>
                        {isHome && (
                            <Link
                                href="/login"
                                className="hover:text-pink-light text-sm transition-colors text-gray-500"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-8 border-t border-pink-heart/10 pt-8 text-center text-sm text-gray-500"
                >
                    &copy; {new Date().getFullYear()} LoveyLink. All rights reserved.
                </motion.div>
            </div>
        </footer>
    );
}
