"use client";

import Link from "next/link";
import { Sparkles, Crown, AlertCircle } from "lucide-react";
import RefreshSubscriptionButton from "./RefreshSubscriptionButton";
import type { SubscriptionDisplayStatus } from "@/lib/premium-access";

type Props = {
    isPremium: boolean;
    status: SubscriptionDisplayStatus;
    label: string;
};

export default function SubscriptionStatusBadge({ isPremium, status, label }: Props) {
    if (isPremium) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-heart/20 border border-pink-heart/40 shadow-[0_0_20px_rgba(255,107,157,0.2)]">
                <Crown className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-bold bg-gradient-to-r from-amber-200 to-pink-200 bg-clip-text text-transparent">
                    Premium Active
                </span>
            </div>
        );
    }

    if (status === "canceled" || status === "past_due" || status === "expired") {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <Link
                    href="/dashboard?upgrade=1"
                    className="ml-1 text-xs font-bold text-pink-heart hover:text-pink-light"
                >
                    Upgrade
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <RefreshSubscriptionButton />
            <Link
                href="/dashboard?upgrade=1"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-heart/10 to-purple-500/10 border border-pink-heart/30 text-white rounded-xl hover:border-pink-heart/60 transition-all"
            >
                <Sparkles className="w-4 h-4 mr-2 text-pink-heart" />
                <span className="text-sm font-semibold">Upgrade to Premium</span>
            </Link>
        </div>
    );
}
