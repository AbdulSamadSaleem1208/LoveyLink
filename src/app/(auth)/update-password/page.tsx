"use client";

import { useState, useEffect } from "react";
import { updatePassword } from "@/app/auth/actions";
import { Loader2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const supabase = createClient();
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    toast.error("Invalid or expired reset link. Please request a new one.");
                    setTimeout(() => router.push("/forgot-password"), 2000);
                    return;
                }

                setValidating(false);
            } catch {
                toast.error("Something went wrong. Please try again.");
                setTimeout(() => router.push("/forgot-password"), 2000);
            }
        };

        checkSession();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);

        try {
            const result = await updatePassword(password);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Password updated successfully!");
                router.push("/dashboard");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Heart className="h-12 w-12 text-red-primary fill-red-primary" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Update your password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-background-card py-8 px-4 shadow-xl border border-white/10 sm:rounded-2xl sm:px-10">
                    {validating ? (
                        <div className="text-center py-8">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto text-red-primary" />
                            <p className="text-gray-400 mt-4">Validating reset link...</p>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-primary outline-none"
                            />
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-primary outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 rounded-xl text-sm font-bold text-white bg-button-gradient hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save new password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
