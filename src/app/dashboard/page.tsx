import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { redirect } from "next/navigation";
import WelcomeConfetti from "@/components/dashboard/WelcomeConfetti";
import LogoutButton from "@/components/dashboard/LogoutButton";
import LovePagesManager from "@/components/dashboard/LovePagesManager";
import SubscriptionStatusPoller from "@/components/dashboard/SubscriptionStatusPoller";
import DashboardBackground from "@/components/dashboard/DashboardBackground";
import SubscriptionStatusBadge from "@/components/dashboard/SubscriptionStatusBadge";
import DashboardAdminLink from "@/components/dashboard/DashboardAdminLink";
import { expireUserPremiumIfDue } from "@/lib/subscription-expiration";
import { resolvePremiumAccess } from "@/lib/premium-access";
import LoginWelcomeBurst from "@/components/dashboard/LoginWelcomeBurst";

export const dynamic = "force-dynamic";

export default async function Dashboard({
    searchParams,
}: {
    searchParams: Promise<{ welcome?: string }>;
}) {
    const params = await searchParams;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    await expireUserPremiumIfDue(user.id);
    const premiumAccess = await resolvePremiumAccess(user.id);

    let lovePages = null;
    let adminRole = null;

    try {
        const results = await Promise.all([
            supabase
                .from("love_pages")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false }),
            supabase.from("admin_roles").select("role").eq("user_id", user.id).single(),
        ]);

        lovePages = results[0].data;
        adminRole = results[1].data;
    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
    }

    if (lovePages && lovePages.length > 0) {
        const { repairBrokenSlugForPage } = await import("@/lib/love-page-slug-repair");
        lovePages = await Promise.all(
            lovePages.map(async (page) => {
                const { slug, repaired } = await repairBrokenSlugForPage(page, user.id);
                return repaired ? { ...page, slug } : page;
            })
        );
    }

    const showWelcome = user.user_metadata?.show_premium_welcome;
    if (showWelcome) {
        await supabase.auth.updateUser({
            data: { show_premium_welcome: null },
        });
    }

    const { isOwnerEmail, isAdminRole } = await import("@/lib/admin");
    const isAdmin =
        isOwnerEmail(user.email) || (!!adminRole && isAdminRole(adminRole.role));

    const firstName =
        user.user_metadata?.full_name?.split(" ")?.[0] ||
        user.email?.split("@")?.[0] ||
        "there";

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <DashboardBackground />
            <SubscriptionStatusPoller
                initialIsPremium={premiumAccess.isPremium}
                initialLabel={premiumAccess.label}
            />
            {params.welcome === "1" && <LoginWelcomeBurst />}
            {showWelcome && <WelcomeConfetti />}

            <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <p className="text-pink-heart text-sm font-semibold mb-1 flex items-center gap-1.5">
                            <Heart className="w-4 h-4 fill-pink-heart" />
                            Welcome back, {firstName}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-pink-100 to-pink-heart/80 bg-clip-text text-transparent">
                            My Love Pages
                        </h1>
                        <p className="text-gray-400">
                            Manage and create your special declarations.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <LogoutButton />
                        {isAdmin && <DashboardAdminLink />}
                        <SubscriptionStatusBadge
                            isPremium={premiumAccess.isPremium}
                            status={premiumAccess.status}
                            label={premiumAccess.label}
                        />
                        <Link
                            href="/create"
                            className="flex items-center px-6 py-2.5 bg-button-gradient text-white rounded-xl shadow-lg shadow-pink-heart/30 hover:opacity-90 transition-all transform hover:scale-105 font-bold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Page
                        </Link>
                    </div>
                </div>

                {lovePages && lovePages.length > 0 ? (
                    <LovePagesManager initialPages={lovePages} />
                ) : (
                    <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 border border-pink-heart/20 rounded-3xl p-16 text-center backdrop-blur-sm shadow-[0_0_60px_rgba(255,107,157,0.08)]">
                        <div className="mx-auto h-24 w-24 bg-pink-heart/10 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-pink-heart/40 ring-4 ring-pink-heart/10">
                            <Heart className="h-10 w-10 text-pink-heart fill-pink-heart animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            No love pages yet
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Start creating your first romantic page to share with your loved
                            one! It only takes a minute.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center px-8 py-3 bg-button-gradient text-white rounded-2xl shadow-lg shadow-pink-heart/25 hover:opacity-90 transition-all font-bold text-lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create My First Page
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
