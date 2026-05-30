import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { redirect } from "next/navigation";
import WelcomeConfetti from "@/components/dashboard/WelcomeConfetti";
import LovePagesManager from "@/components/dashboard/LovePagesManager";
import SubscriptionStatusPoller from "@/components/dashboard/SubscriptionStatusPoller";
import { expireUserPremiumIfDue } from "@/lib/subscription-expiration";
import { resolvePremiumAccess } from "@/lib/premium-access";
import LoginWelcomeBurst from "@/components/dashboard/LoginWelcomeBurst";

export const dynamic = "force-dynamic";

export default async function Dashboard({
    searchParams,
}: {
    searchParams: Promise<{ welcome?: string; upgrade?: string }>;
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

    try {
        const { data } = await supabase
            .from("love_pages")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        lovePages = data;
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

    const firstName =
        user.user_metadata?.full_name?.split(" ")?.[0] ||
        user.email?.split("@")?.[0] ||
        "there";

    const showUpgradeBanner =
        params.upgrade === "1" && !premiumAccess.isPremium;

    return (
        <>
            <SubscriptionStatusPoller
                initialIsPremium={premiumAccess.isPremium}
                initialLabel={premiumAccess.label}
            />
            {params.welcome === "1" && <LoginWelcomeBurst />}
            {showWelcome && <WelcomeConfetti />}

            <div className="mb-8 md:mb-10">
                <p className="text-pink-heart text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-pink-heart shrink-0" />
                    Welcome back, {firstName}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-pink-100 to-pink-heart/80 bg-clip-text text-transparent">
                    My Love Pages
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                    Manage and create your special declarations.
                </p>
            </div>

            {showUpgradeBanner && (
                <div className="mb-6 rounded-2xl border border-pink-heart/30 bg-gradient-to-r from-pink-heart/10 to-red-primary/10 p-4 sm:p-5">
                    <p className="text-white font-semibold mb-1">Upgrade to Premium</p>
                    <p className="text-sm text-gray-400 mb-3">
                        PKR 500 for 30 days — unlimited pages, QR codes, and analytics.
                        Complete Easypaisa payment in the popup.
                    </p>
                </div>
            )}

            <div className="flex justify-end mb-6">
                <Link
                    href="/create"
                    className="inline-flex items-center justify-center px-5 py-3 bg-button-gradient text-white rounded-xl shadow-lg shadow-pink-heart/30 hover:opacity-90 transition-all font-bold w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5 mr-2 shrink-0" />
                    Create New Page
                </Link>
            </div>

            {lovePages && lovePages.length > 0 ? (
                <LovePagesManager initialPages={lovePages} />
            ) : (
                <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 border border-pink-heart/20 rounded-3xl p-8 sm:p-16 text-center backdrop-blur-sm shadow-[0_0_60px_rgba(255,107,157,0.08)]">
                    <div className="mx-auto h-24 w-24 bg-pink-heart/10 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-pink-heart/40 ring-4 ring-pink-heart/10">
                        <Heart className="h-10 w-10 text-pink-heart fill-pink-heart animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No love pages yet</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Start creating your first romantic page to share with your loved one! It
                        only takes a minute.
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
        </>
    );
}
