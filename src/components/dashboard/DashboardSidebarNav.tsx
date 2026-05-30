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
        idle: "text-white/90 bg-pink-heart/10 border-pink-heart/25 hover:bg-pink-heart/20 hover:border-pink-heart/45 hover:shadow-lg hover:shadow-pink-heart/20 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-pink-heart/30 to-red-primary/20 border-pink-heart/40 group-hover:from-pink-heart/45 group-hover:to-red-primary/30 group-hover:border-pink-heart/60",
        icon: "text-pink-heart group-hover:text-white",
        active:
            "bg-gradient-to-r from-pink-heart/35 to-red-primary/25 text-white border-pink-heart/55 shadow-lg shadow-pink-heart/25",
        activeIconBox: "bg-white/15 border-white/25",
        activeIcon: "text-white",
    },
    emerald: {
        idle: "text-white/90 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border-emerald-400/40 group-hover:from-emerald-400/45 group-hover:border-emerald-300/55",
        icon: "text-emerald-300 group-hover:text-white",
        active:
            "bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-white border-emerald-400/55 shadow-lg shadow-emerald-500/20",
        activeIconBox: "bg-white/15 border-white/25",
        activeIcon: "text-emerald-100",
    },
    amber: {
        idle: "text-amber-100 bg-amber-500/12 border-amber-400/35 hover:bg-amber-500/22 hover:border-amber-300/55 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-amber-500/35 to-orange-500/25 border-amber-400/45 group-hover:from-amber-400/50 group-hover:border-amber-300/60",
        icon: "text-amber-300 group-hover:text-amber-50",
        active:
            "bg-gradient-to-r from-amber-500/35 to-orange-500/25 text-white border-amber-400/55 shadow-lg shadow-amber-500/25",
        activeIconBox: "bg-white/15 border-white/25",
        activeIcon: "text-amber-50",
    },
    violet: {
        idle: "text-white/90 bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/20 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-violet-500/30 to-purple-500/20 border-violet-400/40 group-hover:from-violet-400/45 group-hover:border-violet-300/55",
        icon: "text-violet-300 group-hover:text-white",
        active:
            "bg-gradient-to-r from-violet-500/30 to-purple-500/20 text-white border-violet-400/55 shadow-lg shadow-violet-500/20",
        activeIconBox: "bg-white/15 border-white/25",
        activeIcon: "text-violet-100",
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
        <nav className="py-3 px-2 space-y-2">
            {links.map(({ href, label, icon: Icon, active, accent }) => {
                const style = accentStyles[accent];
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        title={collapsed ? label : undefined}
                        className={`group flex items-center rounded-xl border transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] ${
                            collapsed ? "justify-center p-3.5" : "px-3.5 py-3"
                        } ${active ? style.active : style.idle}`}
                    >
                        <span
                            className={`flex items-center justify-center shrink-0 rounded-xl border transition-all duration-200 ${
                                collapsed ? "h-10 w-10" : "h-9 w-9 mr-3"
                            } ${active ? style.activeIconBox : style.iconBox}`}
                        >
                            <Icon
                                className={`w-5 h-5 shrink-0 transition-colors ${
                                    active ? style.activeIcon : style.icon
                                }`}
                            />
                        </span>
                        {!collapsed && (
                            <span className="font-semibold text-sm tracking-tight">
                                {label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
