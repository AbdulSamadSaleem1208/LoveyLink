import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { userHasAdminAccess } from "@/lib/admin-session";
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

    const isAdmin = await userHasAdminAccess(supabase, user);

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
