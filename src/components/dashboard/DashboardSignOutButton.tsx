"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
    onNavigate?: () => void;
    collapsed?: boolean;
};

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
            className={`flex items-center w-full text-red-300/90 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-colors text-left border border-red-500/20 ${
                collapsed ? "justify-center p-3" : "px-4 py-2.5 text-sm font-medium gap-3"
            }`}
        >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
        </button>
    );
}
