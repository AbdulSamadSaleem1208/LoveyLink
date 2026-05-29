"use client";

import { useState } from "react";
import { forgotPassword } from "@/app/auth/actions";
import { Loader2, Heart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const result = await forgotPassword({ email });
            if (result?.error) {
                toast.error(result.error);
                setErrorMsg(result.error);
            } else {
                toast.success("Password reset link sent to your email!");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
            setErrorMsg("Network or client error occurring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Heart className="h-12 w-12 text-red-primary fill-red-primary" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    We&apos;ll email you a link to choose a new password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-background-card py-8 px-4 shadow-xl border border-white/10 sm:rounded-2xl sm:px-10">
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center">
                            {errorMsg}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-primary focus:border-transparent outline-none"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-button-gradient hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send reset link"}
                        </button>
                        <p className="text-center text-sm">
                            <Link href="/login" className="font-medium text-red-primary hover:text-red-accent">
                                Back to sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
