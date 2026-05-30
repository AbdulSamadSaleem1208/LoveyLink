"use server";

import { createClient } from "@supabase/supabase-js";
import { PREMIUM_PLAN_ID } from "@/lib/admin";

const PREMIUM_DAYS = 30;

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: { autoRefreshToken: false, persistSession: false },
        }
    );
}

function isMissingSubscriptionsTable(message: string): boolean {
    const m = message.toLowerCase();
    return (
        m.includes("could not find the table") &&
        m.includes("subscriptions")
    );
}

export type GrantPremiumResult = {
    success: boolean;
    error?: string;
    subscriptionId?: string;
    usedPaymentFallback?: boolean;
};

/**
 * Activates premium for a user after payment approval.
 * Updates subscriptions (if table exists), public.users, and auth metadata.
 */
export async function grantPremiumForPayment(
    userId: string,
    paymentId: string
): Promise<GrantPremiumResult> {
    const supabase = getAdminClient();
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + PREMIUM_DAYS);
    const manualSubscriptionId = `manual_easypaisa_${paymentId}`;

    let subscriptionRecordId: string | null = null;
    let usedPaymentFallback = false;

    const { data: existingSub, error: subFetchError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

    if (subFetchError && !isMissingSubscriptionsTable(subFetchError.message)) {
        return { success: false, error: subFetchError.message };
    }

    if (!subFetchError) {
        const subPayload = {
            user_id: userId,
            status: "active",
            plan_id: PREMIUM_PLAN_ID,
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString(),
        };

        if (existingSub) {
            const { error: upError } = await supabase
                .from("subscriptions")
                .update(subPayload)
                .eq("id", existingSub.id);

            if (upError) {
                if (isMissingSubscriptionsTable(upError.message)) {
                    usedPaymentFallback = true;
                } else {
                    return { success: false, error: `Failed to update subscription: ${upError.message}` };
                }
            } else {
                subscriptionRecordId = existingSub.id;
            }
        } else {
            const { data: inserted, error: insError } = await supabase
                .from("subscriptions")
                .insert({
                    ...subPayload,
                    stripe_subscription_id: manualSubscriptionId,
                })
                .select("id")
                .single();

            if (insError) {
                if (isMissingSubscriptionsTable(insError.message)) {
                    usedPaymentFallback = true;
                } else {
                    return {
                        success: false,
                        error: `Failed to create subscription: ${insError.message}`,
                    };
                }
            } else {
                subscriptionRecordId = inserted?.id ?? null;
            }
        }
    } else {
        usedPaymentFallback = true;
    }

    const { data: authData, error: authError } =
        await supabase.auth.admin.getUserById(userId);

    if (authError || !authData.user?.email) {
        return { success: false, error: "Could not find auth user for this payment" };
    }

    const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

    const userPayload = {
        subscription_status: "active",
        subscription_id: subscriptionRecordId ?? manualSubscriptionId,
        updated_at: now.toISOString(),
    };

    if (publicUser) {
        const { error: userUpError } = await supabase
            .from("users")
            .update(userPayload)
            .eq("id", userId);

        if (userUpError) {
            return { success: false, error: `Failed to update user profile: ${userUpError.message}` };
        }
    } else {
        const { error: userInsError } = await supabase.from("users").insert({
            id: userId,
            email: authData.user.email,
            ...userPayload,
        });

        if (userInsError) {
            return { success: false, error: `Failed to create user profile: ${userInsError.message}` };
        }
    }

    await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
            ...authData.user.user_metadata,
            show_premium_welcome: true,
            subscription_status: "active",
            subscription_updated_at: now.toISOString(),
        },
    });

    return {
        success: true,
        subscriptionId: subscriptionRecordId ?? manualSubscriptionId,
        usedPaymentFallback,
    };
}
