import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";
import { resolvePremiumAccess } from "@/lib/premium-access";
import { getUserDisplayInfo } from "@/lib/get-user-display";

export const dynamic = "force-dynamic";

export default async function AppShellLayout({
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

    const premiumAccess = await resolvePremiumAccess(user.id);

    let isAdmin = isOwnerEmail(user.email);
    if (!isAdmin) {
        const { data: adminRole } = await supabase
            .from("admin_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();
        isAdmin = !!adminRole && isAdminRole(adminRole.role);
    }

    const { displayName } = await getUserDisplayInfo(supabase, user);

    return (
        <DashboardShell
            userEmail={user.email ?? ""}
            displayName={displayName}
            isAdmin={isAdmin}
            isPremium={premiumAccess.isPremium}
            premiumLabel={premiumAccess.label}
        >
            {children}
        </DashboardShell>
    );
}
