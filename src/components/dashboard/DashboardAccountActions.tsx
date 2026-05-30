"use client";

import SubscriptionStatusBadge from "@/components/dashboard/SubscriptionStatusBadge";
import RefreshSubscriptionButton from "@/components/dashboard/RefreshSubscriptionButton";
import type { SubscriptionDisplayStatus } from "@/lib/premium-access";

type Props = {
    isPremium: boolean;
    status: SubscriptionDisplayStatus;
    label: string;
};

export default function DashboardAccountActions({ isPremium, status, label }: Props) {
    return (
        <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-900/80 to-zinc-950/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SubscriptionStatusBadge
                isPremium={isPremium}
                status={status}
                label={label}
            />
            {!isPremium && (
                <div className="text-sm text-gray-400 sm:text-right">
                    <p className="mb-1">Submitted payment?</p>
                    <RefreshSubscriptionButton />
                </div>
            )}
        </div>
    );
}
