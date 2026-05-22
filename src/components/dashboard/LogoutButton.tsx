"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Logout"
        >
            <LogOut className={`w-4 h-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
}
