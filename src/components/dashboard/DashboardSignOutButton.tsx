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
    "bg-gradient-to-r from-red-600/25 via-rose-600/20 to-red-900/30 border-2 border-red-500/50 text-red-100 " +
    "hover:from-red-500/45 hover:via-rose-500/35 hover:to-red-800/40 hover:border-red-300 hover:text-white " +
    "hover:shadow-xl hover:shadow-red-500/35 hover:-translate-y-1 " +
    "active:translate-y-0 active:scale-[0.97] " +
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
                collapsed ? "justify-center p-3.5" : "px-3.5 py-3 text-sm gap-3"
            }`}
        >
            <span
                className={`flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-red-500/50 to-rose-600/40 border border-red-300/50 shadow-inner group-hover:from-red-400/70 group-hover:to-rose-500/60 group-hover:border-red-200 group-hover:scale-105 transition-all duration-200 ${
                    collapsed ? "h-10 w-10" : "h-9 w-9"
                }`}
            >
                <LogOut className="w-4 h-4 text-white drop-shadow-sm" />
            </span>
            {!collapsed && <span>Sign Out</span>}
        </button>
    );
}
