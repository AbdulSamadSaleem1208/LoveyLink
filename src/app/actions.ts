"use server";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function logDebug(message: string) {
    console.log(`[Debug ${new Date().toISOString()}] ${message}`);
}


export async function getSessionSubscriptionStatus() {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { isPremium: false, loggedIn: false };
        }

        const { expireUserPremiumIfDue } = await import("@/lib/subscription-expiration");
        await expireUserPremiumIfDue(user.id);

        const { resolvePremiumAccess } = await import("@/lib/premium-access");
        const access = await resolvePremiumAccess(user.id);
        return {
            isPremium: access.isPremium,
            loggedIn: true,
            message: access.isPremium ? undefined : `Your plan is now ${access.label}.`,
            status: access.status,
            label: access.label,
        };
    } catch {
        return { isPremium: false, loggedIn: false };
    }
}

export async function checkSubscriptionStatus() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("Auth error in checkSubscriptionStatus:", authError);
            return { isPremium: false, error: "Not logged in" };
        }

        const { expireUserPremiumIfDue } = await import("@/lib/subscription-expiration");
        await expireUserPremiumIfDue(user.id);

        const { resolvePremiumAccess } = await import("@/lib/premium-access");
        const access = await resolvePremiumAccess(user.id);

        logDebug(`[CheckSubscription] ${user.id} → premium=${access.isPremium} status=${access.status}`);
        if (!access.isPremium) {
            return {
                isPremium: false,
                error: `Your account is on the ${access.label} plan.`,
                status: access.status,
                label: access.label,
            };
        }
        return { isPremium: true, status: "active", label: "Premium" };
    } catch (error) {
        console.error("Unexpected error checking subscription:", error);
        return { isPremium: false, error: "Internal Server Error" };
    }
}

export async function refreshSubscription() {
    try {
        logDebug("Starting refreshSubscription...");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, error: "Not logged in" };
        logDebug(`refreshSubscription for user: ${user.id}`);

        const supabaseAdmin = createSupabaseAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 1. Check for valid approved payment in payment_requests (Manual Easypaisa)
        const { data: payment, error: paymentError } = await supabaseAdmin
            .from('payment_requests')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: false }) // Get most recent
            .limit(1)
            .single();

        if (paymentError || !payment) {
            logDebug(`No approved payment found: ${JSON.stringify(paymentError)}`);
            return { success: false, error: "No approved payment record found." };
        }
        logDebug(`Found approved payment: ${payment.id}`);

        // 1b. Upsert Subscription (Critical for Dashboard check)
        const manualSubscriptionId = `manual_easypaisa_${payment.id}`;
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30); // Add 30 days

        const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        const subscriptionData = {
            user_id: user.id,
            status: 'active',
            plan_id: 'monthly_pkr_1000',
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
            // Only set stripe_subscription_id on insert to avoid unique constraint if we are updating by ID
            ...(existingSub ? {} : { stripe_subscription_id: manualSubscriptionId })
        };

        if (existingSub) {
            const { error: upError } = await supabaseAdmin
                .from('subscriptions')
                .update(subscriptionData)
                .eq('id', existingSub.id);
            if (upError) logDebug(`Subscription update failed: ${JSON.stringify(upError)}`);
            else logDebug(`Subscription updated: ${existingSub.id}`);
        } else {
            const { error: insError } = await supabaseAdmin
                .from('subscriptions')
                .insert(subscriptionData);
            if (insError) logDebug(`Subscription insert failed: ${JSON.stringify(insError)}`);
            else logDebug("Subscription inserted");
        }

        // 2. Force update user status (Manual Upsert to bypass schema cache error)
        // Check if user exists in public.users
        const { data: publicUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

        if (checkError) logDebug(`Error checking public user: ${JSON.stringify(checkError)}`);

        let updateError = null;

        if (publicUser) {
            // Update
            const { error } = await supabaseAdmin
                .from('users')
                .update({
                    subscription_status: 'active',
                    subscription_id: payment.id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
            updateError = error;
        } else {
            // Insert
            const { error } = await supabaseAdmin
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                    subscription_status: 'active',
                    subscription_id: payment.id,
                    updated_at: new Date().toISOString()
                });
            updateError = error;
        }

        if (updateError) {
            logDebug(`WARNING: Failed to refresh public.users status: ${JSON.stringify(updateError)}`);
            // Do not return error here, as we have a valid payment and subscription check will pass via subscriptions table or payment check
            return { success: true };
        }

        logDebug("Successfully refreshed user status.");
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        logDebug(`Exception in refreshSubscription: ${JSON.stringify(error)}`);
        return { success: false, error: "System error" };
    }
}
