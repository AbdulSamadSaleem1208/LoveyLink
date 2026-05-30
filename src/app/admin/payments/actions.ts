"use server";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";
import { grantPremiumForPayment } from "@/lib/grant-premium";

const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

async function verifyAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized: Please log in");
    }

    const { data: adminRole, error: roleError } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    const isOwner = isOwnerEmail(user.email);

    if (!isOwner && (roleError || !adminRole || !isAdminRole(adminRole.role))) {
        throw new Error("Forbidden: Access denied");
    }

    return user;
}

export async function approvePayment(paymentId: string) {
    try {
        await verifyAdmin();

        const { data: payment, error: fetchError } = await supabaseAdmin
            .from("payment_requests")
            .select("*")
            .eq("id", paymentId)
            .single();

        if (fetchError || !payment) {
            throw new Error("Payment request not found");
        }

        if (payment.status === "rejected") {
            throw new Error("Payment was rejected and cannot be approved");
        }

        // Grant premium FIRST — only mark payment approved after success
        const grant = await grantPremiumForPayment(payment.user_id, payment.id);

        if (!grant.success) {
            const hint = grant.error?.includes("subscriptions")
                ? " Run supabase/migrations/20260530_create_subscriptions_table.sql in Supabase SQL Editor."
                : "";
            return { error: `${grant.error}${hint}` };
        }

        if (payment.status === "pending") {
            const { error: updatePaymentError } = await supabaseAdmin
                .from("payment_requests")
                .update({
                    status: "approved",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", paymentId);

            if (updatePaymentError) {
                return {
                    error: `Premium was granted but payment status failed to update: ${updatePaymentError.message}`,
                };
            }
        }

        revalidatePath("/", "layout");
        revalidatePath("/admin");
        revalidatePath("/admin/payments");
        revalidatePath("/admin/users");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: grant.usedPaymentFallback
                ? "User upgraded to premium (payment record). Run subscriptions migration for full tracking."
                : "Payment approved and user upgraded to premium for 30 days.",
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Approval failed";
        console.error("Approve Payment Error:", error);
        return { error: message };
    }
}

export async function rejectPayment(paymentId: string) {
    try {
        await verifyAdmin();

        const { data: payment, error: fetchError } = await supabaseAdmin
            .from("payment_requests")
            .select("status")
            .eq("id", paymentId)
            .single();

        if (fetchError || !payment) {
            throw new Error("Payment request not found");
        }

        if (payment.status !== "pending") {
            throw new Error("Only pending payments can be rejected");
        }

        const { error } = await supabaseAdmin
            .from("payment_requests")
            .update({
                status: "rejected",
                updated_at: new Date().toISOString(),
            })
            .eq("id", paymentId)
            .eq("status", "pending");

        if (error) throw error;

        revalidatePath("/admin");
        revalidatePath("/admin/payments");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Reject failed";
        console.error("Reject Payment Error:", error);
        return { error: message };
    }
}

export async function getPaymentRequests() {
    try {
        await verifyAdmin();

        const { data: payments, error: paymentsError } = await supabaseAdmin
            .from("payment_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (paymentsError) throw paymentsError;

        if (!payments || payments.length === 0) {
            return { data: [] };
        }

        const userIds = Array.from(new Set(payments.map((p) => p.user_id)));
        const userMap = new Map<string, { email: string; full_name: string }>();

        const { data: profiles } = await supabaseAdmin
            .from("users")
            .select("id, email, full_name")
            .in("id", userIds);

        for (const profile of profiles ?? []) {
            userMap.set(profile.id, {
                email: profile.email ?? "Unknown",
                full_name: profile.full_name || "Unknown",
            });
        }

        const missingIds = userIds.filter((id) => !userMap.has(id));
        if (missingIds.length > 0) {
            await Promise.all(
                missingIds.map(async (uid) => {
                    const {
                        data: { user },
                        error,
                    } = await supabaseAdmin.auth.admin.getUserById(uid);
                    if (!error && user) {
                        userMap.set(uid, {
                            email: user.email ?? "Unknown",
                            full_name:
                                (user.user_metadata?.full_name as string) || "Unknown",
                        });
                    }
                })
            );
        }

        const joinedData = payments.map((p) => ({
            ...p,
            users: userMap.get(p.user_id) || {
                email: "Unknown",
                full_name: "Unknown",
            },
        }));

        return { data: joinedData };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Fetch failed";
        console.error("Fetch Payments Error:", error);
        return { error: message };
    }
}
