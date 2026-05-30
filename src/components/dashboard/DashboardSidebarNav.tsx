"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, PlusCircle, Crown, Shield } from "lucide-react";

type Props = {
    isAdmin: boolean;
    isPremium: boolean;
    collapsed?: boolean;
    onNavigate?: () => void;
};

type NavLink = {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    active: boolean;
    accent: "pink" | "emerald" | "amber" | "violet";
};

const accentStyles = {
    pink: {
        idle: "text-gray-300 hover:text-white hover:bg-pink-heart/15 hover:border-pink-heart/35 border-white/5",
        icon: "text-pink-heart/80 group-hover:text-pink-heart",
        active:
            "bg-gradient-to-r from-pink-heart/30 to-red-primary/20 text-white border-pink-heart/50 shadow-lg shadow-pink-heart/15",
        activeIcon: "text-pink-heart",
    },
    emerald: {
        idle: "text-gray-300 hover:text-white hover:bg-emerald-500/15 hover:border-emerald-500/35 border-white/5",
        icon: "text-emerald-400/90 group-hover:text-emerald-300",
        active:
            "bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-white border-emerald-400/45 shadow-lg shadow-emerald-500/10",
        activeIcon: "text-emerald-300",
    },
    amber: {
        idle: "text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/20 hover:border-amber-400/40 border-amber-500/20 bg-amber-500/5",
        icon: "text-amber-400 group-hover:text-amber-300",
        active:
            "bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-white border-amber-400/50 shadow-lg shadow-amber-500/15",
        activeIcon: "text-amber-300",
    },
    violet: {
        idle: "text-gray-300 hover:text-white hover:bg-violet-500/15 hover:border-violet-500/35 border-white/5",
        icon: "text-violet-400/90 group-hover:text-violet-300",
        active:
            "bg-gradient-to-r from-violet-500/25 to-purple-500/15 text-white border-violet-400/45 shadow-lg shadow-violet-500/10",
        activeIcon: "text-violet-300",
    },
};

export default function DashboardSidebarNav({
    isAdmin,
    isPremium,
    collapsed = false,
    onNavigate,
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const upgradeOpen = searchParams.get("upgrade") === "1";

    const links: NavLink[] = [
        {
            href: "/dashboard",
            label: "My Love Pages",
            icon: LayoutDashboard,
            active: pathname === "/dashboard" && !upgradeOpen,
            accent: "pink",
        },
        {
            href: "/create",
            label: "Create New Page",
            icon: PlusCircle,
            active: pathname.startsWith("/create"),
            accent: "emerald",
        },
        ...(!isPremium
            ? [
                  {
                      href: "/dashboard?upgrade=1",
                      label: "Upgrade Premium",
                      icon: Crown,
                      active: pathname === "/dashboard" && upgradeOpen,
                      accent: "amber" as const,
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      href: "/admin",
                      label: "Administration",
                      icon: Shield,
                      active: pathname.startsWith("/admin"),
                      accent: "violet" as const,
                  },
              ]
            : []),
    ];

    return (
        <nav className="py-2 px-2 space-y-1.5">
            {links.map(({ href, label, icon: Icon, active, accent }) => {
                const style = accentStyles[accent];
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        title={collapsed ? label : undefined}
                        className={`group flex items-center rounded-xl border transition-all duration-200 cursor-pointer touch-manipulation ${
                            collapsed ? "justify-center p-3.5" : "px-4 py-3"
                        } ${active ? style.active : style.idle}`}
                    >
                        <span
                            className={`flex items-center justify-center shrink-0 rounded-lg border transition-colors ${
                                collapsed ? "h-9 w-9" : "h-8 w-8 mr-3"
                            } ${
                                active
                                    ? "bg-white/10 border-white/20"
                                    : "bg-zinc-800/80 border-white/10 group-hover:border-white/20"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 shrink-0 ${
                                    active ? style.activeIcon : style.icon
                                }`}
                            />
                        </span>
                        {!collapsed && (
                            <span className="font-medium text-sm">{label}</span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
