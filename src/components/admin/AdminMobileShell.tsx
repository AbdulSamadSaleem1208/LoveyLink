"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Menu, X, PanelLeft, PanelLeftClose, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";
import AdminNotificationsBanner, {
    type AdminNotification,
} from "@/components/admin/AdminNotificationsBanner";

type Props = {
    userEmail: string;
    notifications: AdminNotification[];
    children: React.ReactNode;
};

const PAGE_TITLES: Record<string, string> = {
    "/admin": "Overview",
    "/admin/users": "Users",
    "/admin/payments": "Payments",
};

export default function AdminMobileShell({
    userEmail,
    notifications,
    children,
}: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const pageTitle =
        PAGE_TITLES[pathname] ??
        (pathname.startsWith("/admin/users") ? "Users" : "Admin");

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
                    href="/admin"
                    onClick={closeSidebar}
                    className="flex items-center gap-3 group min-w-0"
                >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-red-primary/50 shrink-0">
                        <Image src="/logo.png" alt="LoveyLink" fill className="object-cover" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="min-w-0">
                            <p className="font-bold text-white group-hover:text-red-primary transition-colors truncate">
                                LoveyLink
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-red-primary font-semibold">
                                Administration
                            </p>
                        </div>
                    )}
                </Link>
                {!sidebarCollapsed && (
                    <p className="text-xs text-gray-500 mt-3 truncate">{userEmail}</p>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <AdminSidebarNav onNavigate={closeSidebar} />
            </div>

            <div className="shrink-0 p-3 border-t border-white/10 space-y-1 bg-zinc-950/95">
                {!sidebarCollapsed && (
                    <Link
                        href="/"
                        onClick={closeSidebar}
                        className="flex items-center px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                    >
                        <Home className="w-5 h-5 mr-3 shrink-0" />
                        Public website
                    </Link>
                )}
                <AdminSignOutButton />
            </div>
        </>
    );

    const showDesktopSidebar = !sidebarCollapsed;

    return (
        <div data-admin className="min-h-screen min-h-[100dvh] flex flex-col lg:flex-row bg-black text-white">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,0,51,0.12)_0%,_transparent_50%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(219,39,119,0.08)_0%,_transparent_50%)]" />

            <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl safe-top">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    aria-label="Open admin menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-red-primary font-semibold">
                        Admin
                    </p>
                    <p className="text-sm font-bold text-white truncate">{pageTitle}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setSidebarCollapsed((c) => !c)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300"
                    aria-label="Toggle menu"
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
                    w-[min(280px,88vw)]
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    ${showDesktopSidebar ? "lg:translate-x-0 lg:w-64" : "lg:w-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none lg:overflow-hidden"}
                `}
            >
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                    <span className="text-sm font-semibold text-white">Admin menu</span>
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
                <div className="hidden lg:flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-zinc-950/60 shrink-0">
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed((c) => !c)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                        aria-label={sidebarCollapsed ? "Show menu" : "Hide menu"}
                    >
                        {sidebarCollapsed ? (
                            <PanelLeft className="h-5 w-5" />
                        ) : (
                            <PanelLeftClose className="h-5 w-5" />
                        )}
                    </button>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-red-primary font-semibold">
                            Management only
                        </p>
                        <p className="text-lg font-bold text-white truncate">{pageTitle}</p>
                    </div>
                    {sidebarCollapsed && (
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-300 border border-red-500/25 hover:bg-red-500/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </button>
                    )}
                </div>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-10">
                    <AdminNotificationsBanner notifications={notifications} />
                    {children}
                </main>
            </div>
        </div>
    );
}
