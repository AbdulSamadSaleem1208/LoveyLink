import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, Heart, Sparkles, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import WelcomeConfetti from "@/components/dashboard/WelcomeConfetti";
import RefreshSubscriptionButton from "@/components/dashboard/RefreshSubscriptionButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import LovePagesManager from "@/components/dashboard/LovePagesManager";

// Force dynamic rendering - NEVER cache this page (contains user-specific data)
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing environment variables: URL or Service Role Key");
        return (
            <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center">
                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl max-w-md text-center">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Configuration Error</h2>
                    <p className="text-gray-300">The system is missing required configuration. Please contact the administrator.</p>
                </div>
            </div>
        );
    }

    // Initialize Admin Client for robust data fetching (bypass RLS)
    const supabaseAdmin = createSupabaseAdminClient(
        supabaseUrl,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    let lovePages = null;
    let sub = null;
    let adminRole = null;
    let paymentCheck: any = { data: null };

    try {
        // Parallelize independent data fetching
        const results = await Promise.all([
            // 1. Fetch Love Pages
            supabase
                .from('love_pages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),

            // 2. Check subscription status (Source of Truth)
            supabaseAdmin
                .from('subscriptions')
                .select('status, id, current_period_end')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .maybeSingle(),

            // 3. Check admin role
            supabase
                .from('admin_roles')
                .select('role')
                .eq('user_id', user.id)
                .single(),

            // 4. Fallback: Check payment_requests (optimistically fetch to avoid waterfall)
            supabaseAdmin
                .from('payment_requests')
                .select('id, updated_at')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle()
        ]);

        lovePages = results[0].data;
        sub = results[1].data;
        adminRole = results[2].data;
        paymentCheck = results[3];

    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
    }

    if (lovePages && lovePages.length > 0) {
        const { repairBrokenSlugForPage } = await import('@/lib/love-page-slug-repair');
        lovePages = await Promise.all(
            lovePages.map(async (page) => {
                const { slug, repaired } = await repairBrokenSlugForPage(page, user.id);
                return repaired ? { ...page, slug } : page;
            })
        );
    }

    let isPremium = !!sub;

    if (isPremium && sub?.current_period_end) {
        const expiryDate = new Date(sub.current_period_end);
        const now = new Date();
        if (expiryDate < now) {
            const { expireUserSubscription } = await import('@/lib/subscription-utils');
            await expireUserSubscription(user.id);
            isPremium = false;
        }
    }

    if (!isPremium && paymentCheck?.data?.updated_at) {
        const paymentDate = new Date(paymentCheck.data.updated_at);
        const expiryDate = new Date(paymentDate);
        expiryDate.setDate(expiryDate.getDate() + 30);
        if (expiryDate > new Date()) {
            isPremium = true;
        }
    }

    const showWelcome = user.user_metadata?.show_premium_welcome;
    if (showWelcome) {
        await supabase.auth.updateUser({
            data: { show_premium_welcome: null }
        });
    }

    const isAdmin = !!adminRole || user.email === 'moizkiani@loveylink.com';

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 relative">
            {showWelcome && <WelcomeConfetti />}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Love Pages</h1>
                        <p className="text-gray-400">Manage and create your special declarations.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <LogoutButton />
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center px-4 py-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl hover:bg-red-600/20 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Admin
                            </Link>
                        )}

                        {isPremium ? (
                            <div className="flex items-center px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl">
                                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 font-bold">Premium</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <RefreshSubscriptionButton />
                                <Link
                                    href="/pricing"
                                    className="flex items-center px-4 py-2 bg-background-card border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4 mr-2 text-gray-400" />
                                    Upgrade
                                </Link>
                            </div>
                        )}
                        <Link
                            href="/create"
                            className="flex items-center px-6 py-2 bg-button-gradient text-white rounded-xl shadow-lg shadow-red-900/40 hover:opacity-90 transition-all transform hover:scale-105 font-bold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Page
                        </Link>
                    </div>
                </div>

                {lovePages && lovePages.length > 0 ? (
                    <LovePagesManager initialPages={lovePages} />
                ) : (
                    <div className="bg-background-card border border-white/10 rounded-3xl p-16 text-center text-white border-dashed">
                        <div className="mx-auto h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-700">
                            <Heart className="h-10 w-10 text-red-primary animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No love pages yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Start creating your first romantic page to share with your loved one! It only takes a minute.</p>
                        <Link
                            href="/create"
                            className="inline-flex items-center px-8 py-3 bg-button-gradient text-white rounded-2xl shadow-lg hover:opacity-90 transition-all font-bold text-lg"
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
