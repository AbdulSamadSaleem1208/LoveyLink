"use client";

import { useState } from "react";
import { revokePremium } from "@/app/admin/users/actions";
import { toast } from "sonner";
import { Loader2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RevokePremiumButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRevoke = async () => {
        if (!confirm("Are you sure you want to revoke premium access for this user?")) {
            return;
        }

        setLoading(true);
        const result = await revokePremium(userId);

        setLoading(false);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Premium revoked successfully");
            router.refresh();
        }
    };

    return (
        <button
            onClick={handleRevoke}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 disabled:opacity-50"
            title="Revoke Premium"
        >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserX className="w-4 h-4" />}
            Revoke
        </button>
    );
}
