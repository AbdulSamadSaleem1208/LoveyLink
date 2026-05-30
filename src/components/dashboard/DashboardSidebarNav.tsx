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
        idle: "text-pink-light/95 hover:text-white",
        active: "text-white",
        iconBox: "group-hover:scale-105",
        activeIconBox: "group-hover:scale-105",
        icon: "text-[#FF6B9D] group-hover:text-white",
        activeIcon: "text-white",
    },
    emerald: {
        idle: "text-white/90 bg-emerald-500/10 border-emerald-500/35 hover:bg-emerald-500/22 hover:border-emerald-400/55 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5",
        active:
            "text-white bg-emerald-500/22 border-2 border-emerald-400/65 shadow-lg shadow-emerald-500/25 hover:bg-emerald-500/32 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/35 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-emerald-500/35 to-teal-500/25 border-emerald-400/45 group-hover:from-emerald-400/55 group-hover:border-emerald-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-emerald-500/25",
        activeIconBox:
            "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-300/70 shadow-md shadow-emerald-500/30 group-hover:scale-105 group-hover:shadow-lg",
        icon: "text-emerald-300 group-hover:text-white",
        activeIcon: "text-white",
    },
    amber: {
        idle: "text-amber-100 bg-amber-500/12 border-amber-400/40 hover:bg-amber-500/24 hover:border-amber-300/60 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5",
        active:
            "text-white bg-amber-500/22 border-2 border-amber-400/65 shadow-lg shadow-amber-500/25 hover:bg-amber-500/32 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-amber-500/40 to-orange-500/30 border-amber-400/50 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-amber-500/25",
        activeIconBox:
            "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300/70 shadow-md group-hover:scale-105 group-hover:shadow-lg",
        icon: "text-amber-300 group-hover:text-amber-50",
        activeIcon: "text-white",
    },
    violet: {
        idle: "text-white/90 bg-violet-500/10 border-violet-500/35 hover:bg-violet-500/22 hover:border-violet-400/55 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5",
        active:
            "text-white bg-violet-500/22 border-2 border-violet-400/65 shadow-lg shadow-violet-500/25 hover:bg-violet-500/32 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5",
        iconBox:
            "bg-gradient-to-br from-violet-500/35 to-purple-500/25 border-violet-400/45 group-hover:from-violet-400/55 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-violet-500/25",
        activeIconBox:
            "bg-gradient-to-br from-violet-500 to-purple-600 border-violet-300/70 shadow-md group-hover:scale-105 group-hover:shadow-lg",
        icon: "text-violet-300 group-hover:text-white",
        activeIcon: "text-white",
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
                const pinkNavClass =
                    accent === "pink"
                        ? active
                            ? "dashboard-nav-pink--active"
                            : "dashboard-nav-pink--idle"
                        : "";
                const pinkIconClass = accent === "pink" ? "dashboard-nav-pink-icon" : "";

                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        title={collapsed ? label : undefined}
                        className={`group flex items-center rounded-xl border transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] ${
                            collapsed ? "justify-center p-3.5" : "px-3.5 py-3"
                        } ${pinkNavClass} ${active ? style.active : style.idle}`}
                    >
                        <span
                            className={`flex items-center justify-center shrink-0 rounded-xl border transition-all duration-200 ${
                                collapsed ? "h-10 w-10" : "h-9 w-9 mr-3"
                            } ${pinkIconClass} ${active ? style.activeIconBox : style.iconBox}`}
                        >
                            <Icon
                                className={`w-5 h-5 shrink-0 transition-colors ${
                                    active ? style.activeIcon : style.icon
                                }`}
                            />
                        </span>
                        {!collapsed && (
                            <span
                                className={`font-semibold text-sm tracking-tight ${
                                    accent === "pink" ? "text-pink-light group-hover:text-white" : ""
                                }`}
                            >
                                {label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
