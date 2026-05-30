import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Heart, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import WelcomeConfetti from "@/components/dashboard/WelcomeConfetti";
import LovePagesManager from "@/components/dashboard/LovePagesManager";
import SubscriptionStatusPoller from "@/components/dashboard/SubscriptionStatusPoller";
import { expireUserPremiumIfDue } from "@/lib/subscription-expiration";
import { resolvePremiumAccess } from "@/lib/premium-access";
import LoginWelcomeBurst from "@/components/dashboard/LoginWelcomeBurst";
import DashboardAccountActions from "@/components/dashboard/DashboardAccountActions";

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

    const pageCount = lovePages?.length ?? 0;

    return (
        <>
            <SubscriptionStatusPoller
                initialIsPremium={premiumAccess.isPremium}
                initialLabel={premiumAccess.label}
            />
            {params.welcome === "1" && <LoginWelcomeBurst />}
            {showWelcome && <WelcomeConfetti />}

            <div className="rounded-3xl border border-pink-heart/20 bg-gradient-to-br from-zinc-900/80 via-zinc-950/90 to-black p-6 sm:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-heart/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <p className="text-pink-heart text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <Heart className="w-4 h-4 fill-pink-heart shrink-0" />
                            Welcome back, {firstName}
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Your love pages
                        </h1>
                        <p className="text-gray-400 text-sm max-w-md">
                            {pageCount === 0
                                ? "Create a romantic page, share the link, and track who views it."
                                : `You have ${pageCount} page${pageCount === 1 ? "" : "s"}. Filter, search, or create another.`}
                        </p>
                    </div>
                    <Link
                        href="/create"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-button-gradient text-white font-bold shadow-lg shadow-pink-heart/25 hover:opacity-90 transition-all shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        New page
                    </Link>
                </div>
            </div>

            <DashboardAccountActions
                isPremium={premiumAccess.isPremium}
                status={premiumAccess.status}
                label={premiumAccess.label}
            />

            {showUpgradeBanner && (
                <div className="mb-8 rounded-2xl border border-pink-heart/25 bg-pink-heart/5 p-5 flex gap-3">
                    <Sparkles className="w-5 h-5 text-pink-heart shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold text-sm">Upgrade to Premium</p>
                        <p className="text-sm text-gray-400 mt-1">
                            PKR 500 for 30 days — publish pages, QR codes, and analytics.
                        </p>
                    </div>
                </div>
            )}

            {lovePages && lovePages.length > 0 ? (
                <LovePagesManager initialPages={lovePages} />
            ) : (
                <div className="rounded-3xl border border-dashed border-pink-heart/25 bg-zinc-900/30 p-10 sm:p-16 text-center">
                    <div className="mx-auto h-20 w-20 rounded-2xl bg-pink-heart/10 flex items-center justify-center mb-6 border border-pink-heart/20">
                        <Heart className="h-9 w-9 text-pink-heart fill-pink-heart" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No pages yet</h3>
                    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
                        Fill in the required details — title, names, and message — then publish
                        when you are ready.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-button-gradient text-white font-bold hover:opacity-90"
                    >
                        <Plus className="w-5 h-5" />
                        Create your first page
                    </Link>
                </div>
            )}
        </>
    );
}
