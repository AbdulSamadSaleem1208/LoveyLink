import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";
import { expireDueSubscriptions } from "@/lib/subscription-expiration";
import AdminMobileShell from "@/components/admin/AdminMobileShell";
import { type AdminNotification } from "@/components/admin/AdminNotificationsBanner";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminServiceClient() {
    return createSupabaseAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    const isOwner = isOwnerEmail(user.email);

    if (!isOwner && !isAdminRole(adminRole?.role)) {
        redirect("/dashboard");
    }

    await expireDueSubscriptions();

    let adminNotifications: AdminNotification[] = [];
    try {
        const supabaseAdmin = getAdminServiceClient();
        const { data } = await supabaseAdmin
            .from("admin_notifications")
            .select("id, type, user_email, message, created_at")
            .is("read_at", null)
            .order("created_at", { ascending: false })
            .limit(15);
        adminNotifications = (data ?? []) as AdminNotification[];
    } catch {
        adminNotifications = [];
    }

    return (
        <AdminMobileShell
            userEmail={user.email ?? ""}
            notifications={adminNotifications}
        >
            {children}
        </AdminMobileShell>
    );
}
