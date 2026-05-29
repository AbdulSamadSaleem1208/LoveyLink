"use client";

import { login } from "@/app/auth/actions";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/back-button";
import FloatingHearts from "@/components/ui/FloatingHearts";
import Image from "next/image";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const result = await login(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <FloatingHearts count={8} />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 0%, rgba(255,107,157,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(219,39,119,0.1) 0%, transparent 40%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 left-4 z-20"
            >
                <BackButton />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="flex justify-center mb-4">
                    <motion.div
                        animate={{
                            scale: [1, 1.08, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-pink-heart/30 blur-2xl rounded-full scale-150" />
                        <Image
                            src="/logo.png"
                            alt="LoveyLink"
                            width={72}
                            height={72}
                            className="relative rounded-full ring-2 ring-pink-heart/50"
                        />
                    </motion.div>
                </div>

                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center mb-2"
                >
                    <Heart className="h-10 w-10 text-pink-heart fill-pink-heart drop-shadow-[0_0_16px_rgba(255,107,157,0.7)]" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-3xl font-extrabold text-white"
                >
                    Welcome Back
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mt-2 text-center text-sm text-gray-400 flex items-center justify-center gap-1"
                >
                    <Sparkles className="h-3.5 w-3.5 text-pink-heart" />
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-pink-heart hover:text-pink-light transition-colors underline decoration-pink-heart/40 underline-offset-4"
                    >
                        Sign up now
                    </Link>
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6, type: "spring" }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="relative bg-background-card/80 backdrop-blur-xl py-8 px-4 shadow-2xl border border-pink-heart/20 sm:rounded-2xl sm:px-10 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-heart to-transparent" />

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-3 py-2.5 border border-white/10 rounded-xl text-white bg-black/50 focus:outline-none focus:ring-2 focus:ring-pink-heart focus:border-pink-heart sm:text-sm transition-all"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-3 py-2.5 border border-white/10 rounded-xl text-white bg-black/50 focus:outline-none focus:ring-2 focus:ring-pink-heart focus:border-pink-heart sm:text-sm transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-pink-heart transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-pink-heart focus:ring-pink-heart border-gray-600 rounded bg-black/50"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-pink-heart hover:text-pink-light transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-button-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-heart focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg shadow-pink-heart/20 disabled:opacity-60"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <Heart className="w-4 h-4 mr-2 fill-white" />
                                        Sign in
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
