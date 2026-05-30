import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { userHasAdminAccess } from "@/lib/admin-session";
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

    const canAccessAdmin = await userHasAdminAccess(supabase, user);

    if (!canAccessAdmin) {
        redirect("/dashboard");
    }

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
