"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Crown, Home } from "lucide-react";
import DashboardSidebarNav from "@/components/dashboard/DashboardSidebarNav";
import DashboardSignOutButton from "@/components/dashboard/DashboardSignOutButton";
import DashboardQueryEffects from "@/components/dashboard/DashboardQueryEffects";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

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
    const pathname = usePathname();

    const pageTitle =
        PAGE_TITLES[pathname] ??
        (pathname.startsWith("/dashboard/success") ? "Page Published" : "Dashboard");

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

    const closeSidebar = () => setSidebarOpen(false);

    const sidebarContent = (
        <>
            <div className="p-5 border-b border-white/10 shrink-0">
                <Link
                    href="/dashboard"
                    onClick={closeSidebar}
                    className="flex items-center gap-3 group"
                >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-pink-heart/50 shrink-0">
                        <Image src="/logo.png" alt="LoveyLink" fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-white group-hover:text-pink-heart transition-colors truncate">
                            LoveyLink
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-pink-heart font-semibold">
                            Dashboard
                        </p>
                    </div>
                </Link>
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
            </div>

            <Suspense fallback={<div className="flex-1 px-3" />}>
                <DashboardSidebarNav
                    isAdmin={isAdmin}
                    isPremium={isPremium}
                    onNavigate={closeSidebar}
                />
            </Suspense>

            <div className="mt-auto p-4 border-t border-white/10 space-y-1 shrink-0">
                <Link
                    href="/"
                    onClick={closeSidebar}
                    className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                    <Home className="w-5 h-5 mr-3 shrink-0" />
                    Website Home
                </Link>
                <DashboardSignOutButton onNavigate={closeSidebar} />
            </div>
        </>
    );

    return (
        <div className="min-h-screen min-h-[100dvh] flex flex-col lg:flex-row bg-black text-white relative">
            <DashboardBackground />

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
                <div className="w-10" aria-hidden />
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
                    fixed lg:sticky top-0 left-0 z-[70] lg:z-10
                    h-full min-h-[100dvh] w-[min(280px,85vw)] lg:w-64
                    flex flex-col border-r border-white/10 bg-zinc-950/98 lg:bg-zinc-950/90 backdrop-blur-xl
                    transition-transform duration-300 ease-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
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

            <main className="relative z-10 flex-1 w-full min-w-0 overflow-x-hidden overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">{children}</div>
            </main>
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
