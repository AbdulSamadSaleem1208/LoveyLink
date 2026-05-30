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
            <div className="p-4 border-b border-white/10 shrink-0">
                <Link
                    href="/dashboard"
                    onClick={closeSidebar}
                    className="flex items-center gap-3 group min-w-0"
                >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-pink-heart/50 shrink-0">
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
                            className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                isPremium
                                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                    : "bg-white/5 text-gray-400 border-white/10"
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

            <div className="shrink-0 p-3 border-t border-white/10 space-y-1 bg-zinc-950/95">
                {!sidebarCollapsed && (
                    <Link
                        href="/"
                        onClick={closeSidebar}
                        className="flex items-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                    >
                        <Home className="w-5 h-5 mr-3 shrink-0" />
                        Website Home
                    </Link>
                )}
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
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
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
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
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
                    h-[100dvh] flex flex-col border-r border-white/10 bg-zinc-950/98 backdrop-blur-xl
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
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
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
                            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-300 border border-red-500/25 hover:bg-red-500/10"
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
