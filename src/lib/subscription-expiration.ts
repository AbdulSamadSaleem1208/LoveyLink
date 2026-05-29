"use server";

import { createClient } from "@supabase/supabase-js";

const PREMIUM_DAYS = 30;

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

export type ExpireSubscriptionsResult = {
    success: boolean;
    expiredCount: number;
    error?: string;
};

/**
 * Expire all active subscriptions past current_period_end (30-day period).
 * Creates admin notifications for each auto-expired user.
 */
export async function expireDueSubscriptions(): Promise<ExpireSubscriptionsResult> {
    try {
        const supabase = getAdminClient();
        const now = new Date().toISOString();

        const { data: dueSubs, error: fetchError } = await supabase
            .from("subscriptions")
            .select("id, user_id, current_period_end")
            .eq("status", "active")
            .lt("current_period_end", now);

        if (fetchError) {
            return { success: false, expiredCount: 0, error: fetchError.message };
        }

        let expiredCount = 0;

        for (const sub of dueSubs ?? []) {
            const expired = await expireSingleUserPremium(
                supabase,
                sub.user_id,
                "auto",
                sub.current_period_end
            );
            if (expired) expiredCount++;
        }

        expiredCount += await expireStalePaymentPremiums(supabase);

        return { success: true, expiredCount };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Expiration failed";
        return { success: false, expiredCount: 0, error: message };
    }
}

/**
 * Expire one user's premium if their active subscription period has ended.
 */
export async function expireUserPremiumIfDue(userId: string): Promise<boolean> {
    const supabase = getAdminClient();

    const { data: sub } = await supabase
        .from("subscriptions")
        .select("id, status, current_period_end")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

    if (sub?.current_period_end && new Date(sub.current_period_end) < new Date()) {
        return expireSingleUserPremium(supabase, userId, "auto", sub.current_period_end);
    }

    const { data: payment } = await supabase
        .from("payment_requests")
        .select("id, updated_at")
        .eq("user_id", userId)
        .eq("status", "approved")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!payment?.updated_at) {
        return false;
    }

    const expiryDate = new Date(payment.updated_at);
    expiryDate.setDate(expiryDate.getDate() + PREMIUM_DAYS);

    if (expiryDate >= new Date()) {
        return false;
    }

    const { data: profile } = await supabase
        .from("users")
        .select("subscription_status, email")
        .eq("id", userId)
        .maybeSingle();

    if (profile?.subscription_status !== "active" && !sub) {
        return false;
    }

    return expireSingleUserPremium(supabase, userId, "auto", expiryDate.toISOString());
}

async function expireStalePaymentPremiums(
    supabase: ReturnType<typeof getAdminClient>
): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - PREMIUM_DAYS);

    const { data: payments } = await supabase
        .from("payment_requests")
        .select("user_id, updated_at")
        .eq("status", "approved")
        .lt("updated_at", cutoff.toISOString());

    if (!payments?.length) return 0;

    let count = 0;
    const seen = new Set<string>();

    for (const payment of payments) {
        if (seen.has(payment.user_id)) continue;
        seen.add(payment.user_id);

        const { data: activeSub } = await supabase
            .from("subscriptions")
            .select("status, current_period_end")
            .eq("user_id", payment.user_id)
            .eq("status", "active")
            .maybeSingle();

        if (
            activeSub?.current_period_end &&
            new Date(activeSub.current_period_end) >= new Date()
        ) {
            continue;
        }

        const expiryDate = new Date(payment.updated_at);
        expiryDate.setDate(expiryDate.getDate() + PREMIUM_DAYS);

        const expired = await expireSingleUserPremium(
            supabase,
            payment.user_id,
            "auto",
            expiryDate.toISOString()
        );
        if (expired) count++;
    }

    return count;
}

async function expireSingleUserPremium(
    supabase: ReturnType<typeof getAdminClient>,
    userId: string,
    reason: "auto" | "admin",
    periodEnd?: string | null
): Promise<boolean> {
    const { data: profile } = await supabase
        .from("users")
        .select("email, subscription_status")
        .eq("id", userId)
        .maybeSingle();

    const { data: sub } = await supabase
        .from("subscriptions")
        .select("id, status")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

    if (!sub) {
        if (profile?.subscription_status === "active") {
            await supabase
                .from("users")
                .update({
                    subscription_status: "free",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId);
        }
        return false;
    }

    const now = new Date().toISOString();

    await supabase
        .from("subscriptions")
        .update({
            status: "expired",
            current_period_end: now,
            updated_at: now,
        })
        .eq("id", sub.id);

    await supabase
        .from("users")
        .update({
            subscription_status: "free",
            updated_at: now,
        })
        .eq("id", userId);

    await bumpUserSubscriptionMetadata(supabase, userId, "free");

    if (reason === "auto") {
        const email = profile?.email ?? "Unknown user";
        const endLabel = periodEnd
            ? new Date(periodEnd).toLocaleDateString()
            : "end of billing period";

        await supabase.from("admin_notifications").insert({
            type: "premium_expired",
            user_id: userId,
            user_email: email,
            message: `Premium deactivated for ${email} — 1-month period ended on ${endLabel}.`,
        });
    }

    return true;
}

export async function syncSubscriptionForAdminEdit(
    userId: string,
    subscriptionStatus: string
): Promise<void> {
    const supabase = getAdminClient();
    const now = new Date();

    if (subscriptionStatus === "active") {
        const periodEnd = new Date(now);
        periodEnd.setDate(periodEnd.getDate() + PREMIUM_DAYS);

        const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

        const subPayload = {
            user_id: userId,
            status: "active",
            plan_id: "monthly_pkr_500",
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString(),
        };

        if (existingSub) {
            await supabase.from("subscriptions").update(subPayload).eq("id", existingSub.id);
        } else {
            await supabase.from("subscriptions").insert({
                ...subPayload,
                stripe_subscription_id: `admin_manual_${userId}`,
            });
        }

        await bumpUserSubscriptionMetadata(supabase, userId, "active");
        return;
    }

    const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

    if (existingSub) {
        await supabase
            .from("subscriptions")
            .update({
                status: "expired",
                current_period_end: now.toISOString(),
                updated_at: now.toISOString(),
            })
            .eq("id", existingSub.id);
    }

    // Stop payment fallback from re-granting premium after admin cancel/revoke
    await supabase
        .from("payment_requests")
        .update({
            status: "revoked",
            updated_at: now.toISOString(),
        })
        .eq("user_id", userId)
        .eq("status", "approved");

    await bumpUserSubscriptionMetadata(supabase, userId, subscriptionStatus);
}

async function bumpUserSubscriptionMetadata(
    supabase: ReturnType<typeof getAdminClient>,
    userId: string,
    subscriptionStatus: string
) {
    const { data: authData } = await supabase.auth.admin.getUserById(userId);
    const existingMeta = authData.user?.user_metadata ?? {};

    await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
            ...existingMeta,
            subscription_status: subscriptionStatus,
            subscription_updated_at: new Date().toISOString(),
        },
    });
}
