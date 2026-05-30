"use client";

import SubscriptionStatusBadge from "@/components/dashboard/SubscriptionStatusBadge";
import type { SubscriptionDisplayStatus } from "@/lib/premium-access";

type Props = {
    isPremium: boolean;
    status: SubscriptionDisplayStatus;
    label: string;
};

/** Premium status + upgrade / restore — shown on dashboard for all users (not admin-only). */
export default function DashboardAccountActions({ isPremium, status, label }: Props) {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <SubscriptionStatusBadge
                isPremium={isPremium}
                status={status}
                label={label}
            />
        </div>
    );
}
