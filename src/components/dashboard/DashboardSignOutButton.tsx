"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
    onNavigate?: () => void;
};

export default function DashboardSignOutButton({ onNavigate }: Props) {
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
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
        >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Sign Out
        </button>
    );
}
