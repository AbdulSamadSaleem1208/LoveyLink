"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";
import { syncSubscriptionForAdminEdit } from "@/lib/subscription-expiration";

// Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function revokePremium(userId: string) {
    try {
        // Verify Requester is Admin
        const authClient = await createAuthClient();
        const { data: { user: requester } } = await authClient.auth.getUser();

        if (!requester) {
            console.error('[Admin] Revoke attempt without authentication');
            return { error: "Unauthorized" };
        }

        const { data: adminRole } = await supabaseAdmin
            .from('admin_roles')
            .select('role')
            .eq('user_id', requester.id)
            .single();

        const isOwner = isOwnerEmail(requester.email);

        if (!isOwner && (!adminRole || !isAdminRole(adminRole.role))) {
            console.error(`[Admin] Unauthorized revoke attempt by ${requester.email}`);
            return { error: "Forbidden" };
        }

        // Proceed to Revoke
        console.log(`[Admin] Revoking premium for user ${userId} by ${requester.email}`);

        // 1. Check if user exists
        const { data: targetUser, error: userCheckError } = await supabaseAdmin
            .from('users')
            .select('id, email, subscription_status')
            .eq('id', userId)
            .maybeSingle();

        if (userCheckError) {
            console.error('[Admin] Error checking target user:', userCheckError);
            return { error: "Failed to verify user" };
        }

        if (!targetUser) {
            console.error(`[Admin] User ${userId} not found`);
            return { error: "User not found" };
        }

        console.log(`[Admin] Target user: ${targetUser.email}, current status: ${targetUser.subscription_status}`);

        // 2. Expire Subscription (if exists)
        const { data: existingSub, error: subCheckError } = await supabaseAdmin
            .from('subscriptions')
            .select('id, status')
            .eq('user_id', userId)
            .maybeSingle();

        if (subCheckError) {
            console.error('[Admin] Error checking subscription:', subCheckError);
            // Continue anyway - we'll update the user record
        }

        if (existingSub) {
            console.log(`[Admin] Found subscription ${existingSub.id} with status: ${existingSub.status}`);

            const { error: subUpdateError } = await supabaseAdmin
                .from('subscriptions')
                .update({
                    status: 'expired',
                    current_period_end: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingSub.id);

            if (subUpdateError) {
                console.error('[Admin] Revoke Sub Error:', subUpdateError);
                return { error: `Failed to update subscription: ${subUpdateError.message}` };
            }

            console.log(`[Admin] Successfully expired subscription ${existingSub.id}`);
        } else {
            console.log(`[Admin] No subscription record found for user ${userId}`);
        }

        // 3. Update User Profile
        const { error: userUpdateError } = await supabaseAdmin
            .from('users')
            .update({
                subscription_status: 'free',
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (userUpdateError) {
            console.error('[Admin] Revoke User Error:', userUpdateError);
            // If subscription was updated but user update failed, log it but don't fail
            if (existingSub) {
                console.warn('[Admin] Subscription expired but user status update failed');
            }
            return { error: `Failed to update user status: ${userUpdateError.message}` };
        }

        console.log(`[Admin] Successfully updated user ${targetUser.email} to free status`);

        // Bump auth metadata so logged-in user sees revoked premium on next poll
        await syncSubscriptionForAdminEdit(userId, "free");

        // 4. Mark payment_requests as revoked (if any exist)
        // This prevents the fallback logic from granting premium access
        const { data: paymentRequests } = await supabaseAdmin
            .from('payment_requests')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'approved');

        if (paymentRequests && paymentRequests.length > 0) {
            const { error: paymentRevokeError } = await supabaseAdmin
                .from('payment_requests')
                .update({
                    status: 'revoked',
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('status', 'approved');

            if (paymentRevokeError) {
                console.warn('[Admin] Failed to revoke payment_requests:', paymentRevokeError);
                // Non-critical, continue
            } else {
                console.log(`[Admin] Revoked ${paymentRequests.length} payment request(s) for user ${userId}`);
            }
        }

        revalidatePath('/admin/users');
        revalidatePath('/dashboard');

        return {
            success: true,
            message: `Successfully revoked premium for ${targetUser.email}`
        };

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error('[Admin] Revoke Exception:', error);
        return { error: `System error: ${message}` };
    }
}

async function verifyAdminRequester() {
    const authClient = await createAuthClient();
    const { data: { user: requester } } = await authClient.auth.getUser();

    if (!requester) {
        return { error: "Unauthorized" as const, requester: null };
    }

    const { data: adminRole } = await supabaseAdmin
        .from("admin_roles")
        .select("role")
        .eq("user_id", requester.id)
        .single();

    const isOwner = isOwnerEmail(requester.email);

    if (!isOwner && (!adminRole || !isAdminRole(adminRole.role))) {
        return { error: "Forbidden" as const, requester: null };
    }

    return { requester, error: null };
}

export async function updateUser(
    userId: string,
    data: { full_name: string; subscription_status: string }
) {
    try {
        const auth = await verifyAdminRequester();
        if (auth.error) return { error: auth.error };

        const { error } = await supabaseAdmin
            .from("users")
            .update({
                full_name: data.full_name || null,
                subscription_status: data.subscription_status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

        if (error) {
            return { error: error.message };
        }

        await syncSubscriptionForAdminEdit(userId, data.subscription_status);

        revalidatePath("/admin/users");
        revalidatePath("/admin");
        revalidatePath("/dashboard");
        revalidatePath("/create");
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Update failed";
        return { error: message };
    }
}

export async function deleteUser(userId: string) {
    try {
        const auth = await verifyAdminRequester();
        if (auth.error) return { error: auth.error };

        if (auth.requester?.id === userId) {
            return { error: "You cannot delete your own account" };
        }

        await supabaseAdmin.from("love_pages").delete().eq("user_id", userId);
        await supabaseAdmin.from("subscriptions").delete().eq("user_id", userId);
        await supabaseAdmin.from("payment_requests").delete().eq("user_id", userId);
        await supabaseAdmin.from("admin_roles").delete().eq("user_id", userId);

        const { error: profileError } = await supabaseAdmin.from("users").delete().eq("id", userId);
        if (profileError) {
            return { error: profileError.message };
        }

        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (authError) {
            return { error: authError.message };
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Delete failed";
        return { error: message };
    }
}
