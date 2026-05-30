"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
    onNavigate?: () => void;
    collapsed?: boolean;
};

const signOutBase =
    "group flex items-center w-full cursor-pointer select-none rounded-xl text-left font-semibold transition-all duration-200 " +
    "bg-gradient-to-r from-red-950/50 to-rose-950/40 border border-red-500/40 text-red-200 " +
    "hover:from-red-600/35 hover:to-rose-600/25 hover:border-red-400/70 hover:text-white " +
    "hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 " +
    "active:translate-y-0 active:scale-[0.98] active:shadow-red-500/20 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function DashboardSignOutButton({ onNavigate, collapsed }: Props) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        onNavigate?.();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
            return;
        }
        router.push("/login");
        router.refresh();
    };

    return (
        <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? "Sign out" : undefined}
            aria-label="Sign out of your account"
            className={`${signOutBase} ${
                collapsed ? "justify-center p-3.5" : "px-4 py-3 text-sm gap-3"
            }`}
        >
            <span
                className={`flex items-center justify-center shrink-0 rounded-lg bg-red-500/25 border border-red-400/40 group-hover:bg-red-500/40 group-hover:border-red-300/60 transition-colors ${
                    collapsed ? "h-9 w-9" : "h-8 w-8"
                }`}
            >
                <LogOut className="w-4 h-4 text-red-200 group-hover:text-white transition-colors" />
            </span>
            {!collapsed && <span>Sign Out</span>}
        </button>
    );
}
