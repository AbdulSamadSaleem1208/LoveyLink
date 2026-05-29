"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: { autoRefreshToken: false, persistSession: false },
    }
);

async function verifyAdmin() {
    const authClient = await createAuthClient();
    const {
        data: { user },
    } = await authClient.auth.getUser();
    if (!user) return false;

    const { data: adminRole } = await supabaseAdmin
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    return isOwnerEmail(user.email) || (!!adminRole && isAdminRole(adminRole.role));
}

export async function markAdminNotificationRead(notificationId: string) {
    if (!(await verifyAdmin())) {
        return { error: "Forbidden" };
    }

    const { error } = await supabaseAdmin
        .from("admin_notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notificationId);

    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { success: true };
}

export async function markAllAdminNotificationsRead() {
    if (!(await verifyAdmin())) {
        return { error: "Forbidden" };
    }

    const { error } = await supabaseAdmin
        .from("admin_notifications")
        .update({ read_at: new Date().toISOString() })
        .is("read_at", null);

    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { success: true };
}
