"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Crown, Home, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import DashboardSidebarNav from "@/components/dashboard/DashboardSidebarNav";
import DashboardSignOutButton from "@/components/dashboard/DashboardSignOutButton";
import DashboardQueryEffects from "@/components/dashboard/DashboardQueryEffects";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

const SIDEBAR_KEY = "loveylink-sidebar-collapsed";

const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "My Love Pages",
    "/create": "Create Page",
};

type Props = {
    userEmail: string;
    displayName: string;
    isAdmin: boolean;
    isPremium: boolean;
    premiumLabel: string;
    children: React.ReactNode;
};

function DashboardShellInner({
    userEmail,
    displayName,
    isAdmin,
    isPremium,
    premiumLabel,
    children,
}: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const pageTitle =
        PAGE_TITLES[pathname] ??
        (pathname.startsWith("/dashboard/success") ? "Page Published" : "Dashboard");

    useEffect(() => {
        try {
            setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    const toggleCollapsed = useCallback(() => {
        setSidebarCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
            } catch {
                /* ignore */
            }
            return next;
        });
    }, []);

    const closeSidebar = () => setSidebarOpen(false);

    const handleSignOut = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
            return;
        }
        router.push("/login");
        router.refresh();
    };

    const sidebarContent = (
        <>
            <div className="p-4 border-b border-pink-heart/25 shrink-0 bg-gradient-to-br from-pink-heart/15 via-zinc-950/50 to-violet-600/10">
                <Link
                    href="/dashboard"
                    onClick={closeSidebar}
                    className="flex items-center gap-3 group min-w-0 cursor-pointer rounded-xl p-1 -m-1 hover:bg-white/5 transition-colors"
                >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-pink-heart shadow-lg shadow-pink-heart/30 shrink-0 group-hover:ring-pink-heart/80 transition-all">
                        <Image src="/logo.png" alt="LoveyLink" fill className="object-cover" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="min-w-0">
                            <p className="font-bold text-white group-hover:text-pink-heart transition-colors truncate">
                                LoveyLink
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-pink-heart font-semibold">
                                Dashboard
                            </p>
                        </div>
                    )}
                </Link>
                {!sidebarCollapsed && (
                    <>
                        <p className="text-sm text-white font-medium mt-3 truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                        <div
                            className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
                                isPremium
                                    ? "bg-gradient-to-r from-amber-500/25 to-orange-500/15 text-amber-200 border-amber-400/40"
                                    : "bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 text-gray-300 border-white/15"
                            }`}
                        >
                            {isPremium && <Crown className="w-3 h-3" />}
                            {premiumLabel}
                        </div>
                    </>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <Suspense fallback={<div className="flex-1 px-3" />}>
                    <DashboardSidebarNav
                        isAdmin={isAdmin}
                        isPremium={isPremium}
                        collapsed={sidebarCollapsed}
                        onNavigate={closeSidebar}
                    />
                </Suspense>
            </div>

            <div className="shrink-0 p-3 border-t border-pink-heart/20 space-y-2 bg-gradient-to-t from-sky-950/20 via-zinc-950 to-red-950/15">
                <Link
                    href="/"
                    onClick={closeSidebar}
                    title={sidebarCollapsed ? "Website Home" : undefined}
                    className={`group flex items-center text-sky-100 hover:text-white bg-gradient-to-r from-sky-600/20 to-blue-600/15 border border-sky-400/35 hover:border-sky-300/60 hover:from-sky-500/30 hover:to-blue-500/25 rounded-xl transition-all duration-200 font-semibold cursor-pointer hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 active:scale-[0.98] ${
                        sidebarCollapsed
                            ? "justify-center p-3.5"
                            : "px-3.5 py-3 text-sm gap-3"
                    }`}
                >
                    <span
                        className={`flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-sky-500/40 to-blue-600/30 border border-sky-300/40 group-hover:scale-105 transition-transform ${
                            sidebarCollapsed ? "h-10 w-10" : "h-9 w-9"
                        }`}
                    >
                        <Home className="w-4 h-4 text-white" />
                    </span>
                    {!sidebarCollapsed && <span>Website Home</span>}
                </Link>
                <DashboardSignOutButton
                    onNavigate={closeSidebar}
                    collapsed={sidebarCollapsed}
                />
            </div>
        </>
    );

    const showDesktopSidebar = !sidebarCollapsed;

    return (
        <div
            data-dashboard
            className="min-h-screen min-h-[100dvh] flex flex-col lg:flex-row bg-black text-white relative"
        >
            <DashboardBackground />

            {/* Mobile header */}
            <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl safe-top">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-2.5 rounded-xl bg-pink-heart/15 border border-pink-heart/35 text-white hover:bg-pink-heart/25 hover:border-pink-heart/50 cursor-pointer transition-all"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-pink-heart font-semibold">
                        LoveyLink
                    </p>
                    <p className="text-sm font-bold text-white truncate">{pageTitle}</p>
                </div>
                <button
                    type="button"
                    onClick={toggleCollapsed}
                    className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-400/35 text-violet-200 hover:text-white hover:bg-violet-500/25 hover:border-violet-300/50 cursor-pointer transition-all"
                    aria-label="Toggle sidebar"
                >
                    <PanelLeftClose className="h-5 w-5" />
                </button>
            </header>

            {sidebarOpen && (
                <button
                    type="button"
                    className="lg:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                    aria-label="Close menu"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`
                    fixed lg:sticky top-0 left-0 z-[70] lg:z-20
                    h-[100dvh] flex flex-col border-r border-pink-heart/20 bg-zinc-950/98 backdrop-blur-xl
                    shadow-[inset_-1px_0_0_0_rgba(255,107,157,0.15)]
                    transition-all duration-300 ease-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    ${showDesktopSidebar ? "lg:translate-x-0 lg:w-64" : "lg:translate-x-0 lg:w-0 lg:border-r-0 lg:overflow-hidden lg:pointer-events-none lg:opacity-0"}
                    w-[min(280px,88vw)]
                `}
            >
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                    <span className="text-sm font-semibold text-white">Menu</span>
                    <button
                        type="button"
                        onClick={closeSidebar}
                        className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {sidebarContent}
            </aside>

            <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-0">
                {/* Desktop toolbar: collapse + page title */}
                <div className="hidden lg:flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-zinc-950/60 backdrop-blur-md shrink-0">
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-400/30 text-violet-200 hover:text-white hover:bg-violet-500/25 hover:border-violet-300/50 cursor-pointer transition-all"
                        aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                        title={sidebarCollapsed ? "Show menu" : "Hide menu"}
                    >
                        {sidebarCollapsed ? (
                            <PanelLeft className="h-5 w-5" />
                        ) : (
                            <PanelLeftClose className="h-5 w-5" />
                        )}
                    </button>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-pink-heart font-semibold">
                            Your workspace
                        </p>
                        <p className="text-lg font-bold text-white truncate">{pageTitle}</p>
                    </div>
                    {sidebarCollapsed && (
                        <button
                            type="button"
                            onClick={handleSignOut}
                            aria-label="Sign out of your account"
                            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer select-none text-red-100 border border-red-500/45 bg-gradient-to-r from-red-950/60 to-rose-950/50 hover:from-red-600/35 hover:to-rose-600/25 hover:border-red-400/70 hover:text-white hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    )}
                </div>

                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardShell(props: Props) {
    return (
        <>
            <Suspense fallback={null}>
                <DashboardQueryEffects />
            </Suspense>
            <DashboardShellInner {...props} />
        </>
    );
}
