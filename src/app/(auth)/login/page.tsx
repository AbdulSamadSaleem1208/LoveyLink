"use client";

import { login } from "@/app/auth/actions";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Loader2, Eye, EyeOff, Sparkles, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/ui/FloatingHearts";
import LoginSparkles from "@/components/auth/LoginSparkles";
import Image from "next/image";
import { visibleInputClass } from "@/lib/form-input-styles";

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
            <FloatingHearts count={12} />
            <LoginSparkles />

            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-pink-heart/10 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 7, repeat: Infinity }}
            />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 0%, rgba(255,107,157,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(219,39,119,0.12) 0%, transparent 40%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 left-4 z-20"
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-pink-heart/35 bg-pink-heart/10 px-3.5 py-2.5 text-sm font-semibold text-pink-light hover:text-white hover:bg-pink-heart/20 hover:border-pink-heart/55 hover:shadow-lg hover:shadow-pink-heart/20 transition-all cursor-pointer"
                >
                    <Home className="h-4 w-4 shrink-0" />
                    Main website
                </Link>
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
                <div className="relative bg-background-card/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-pink-heart/10 border border-pink-heart/25 sm:rounded-2xl sm:px-10 overflow-hidden">
                    <motion.div
                        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-pink-heart/40 via-purple-500/30 to-pink-heart/40 opacity-60 -z-10"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
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
                                    className={visibleInputClass}
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
                                    className={`${visibleInputClass} pr-11`}
                                    style={{ WebkitTextFillColor: "#ffffff" }}
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

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-gray-300 border border-white/15 bg-white/5 hover:text-white hover:bg-white/10 hover:border-pink-heart/30 transition-all cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 text-pink-heart" />
                            Back to main website
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
