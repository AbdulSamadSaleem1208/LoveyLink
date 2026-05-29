"use server";

import { createClient } from "@supabase/supabase-js";

const PREMIUM_DAYS = 30;

const BLOCKED_STATUSES = new Set(["free", "canceled", "past_due", "expired"]);

export type SubscriptionDisplayStatus =
    | "active"
    | "free"
    | "canceled"
    | "past_due"
    | "expired";

export type PremiumAccessResult = {
    isPremium: boolean;
    status: SubscriptionDisplayStatus;
    label: string;
};

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: { autoRefreshToken: false, persistSession: false },
        }
    );
}

function statusLabel(status: SubscriptionDisplayStatus, isPremium: boolean): string {
    if (isPremium) return "Premium";
    switch (status) {
        case "canceled":
            return "Canceled";
        case "past_due":
            return "Past due";
        case "expired":
            return "Expired";
        default:
            return "Free";
    }
}

function normalizeStatus(raw: string | null | undefined): SubscriptionDisplayStatus {
    if (raw === "active" || raw === "canceled" || raw === "past_due" || raw === "expired") {
        return raw;
    }
    return "free";
}

/**
 * Single source of truth for whether a user has premium access.
 * Admin-set status (canceled/free/past_due) always blocks premium, even if old payments exist.
 */
export async function resolvePremiumAccess(userId: string): Promise<PremiumAccessResult> {
    const supabase = getAdminClient();

    const { data: profile } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", userId)
        .maybeSingle();

    const userStatus = normalizeStatus(profile?.subscription_status);

    if (BLOCKED_STATUSES.has(userStatus)) {
        return {
            isPremium: false,
            status: userStatus,
            label: statusLabel(userStatus, false),
        };
    }

    const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

    if (sub) {
        const expired =
            sub.current_period_end && new Date(sub.current_period_end) < new Date();
        if (!expired) {
            return {
                isPremium: true,
                status: "active",
                label: "Premium",
            };
        }
    }

    const { data: payment } = await supabase
        .from("payment_requests")
        .select("id, updated_at, status")
        .eq("user_id", userId)
        .eq("status", "approved")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (payment?.updated_at) {
        const expiryDate = new Date(payment.updated_at);
        expiryDate.setDate(expiryDate.getDate() + PREMIUM_DAYS);
        if (expiryDate > new Date()) {
            return {
                isPremium: true,
                status: "active",
                label: "Premium",
            };
        }
    }

    return {
        isPremium: false,
        status: userStatus === "active" ? "expired" : userStatus,
        label: statusLabel(userStatus === "active" ? "expired" : userStatus, false),
    };
}
