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

export default function DashboardSidebarNav({
    isAdmin,
    isPremium,
    collapsed = false,
    onNavigate,
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const upgradeOpen = searchParams.get("upgrade") === "1";

    const links = [
        {
            href: "/dashboard",
            label: "My Love Pages",
            icon: LayoutDashboard,
            active: pathname === "/dashboard" && !upgradeOpen,
        },
        {
            href: "/create",
            label: "Create New Page",
            icon: PlusCircle,
            active: pathname.startsWith("/create"),
        },
        ...(!isPremium
            ? [
                  {
                      href: "/dashboard?upgrade=1",
                      label: "Upgrade Premium",
                      icon: Crown,
                      active: pathname === "/dashboard" && upgradeOpen,
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      href: "/admin",
                      label: "Admin Panel",
                      icon: Shield,
                      active: pathname.startsWith("/admin"),
                  },
              ]
            : []),
    ];

    return (
        <nav className="py-2 px-2 space-y-1">
            {links.map(({ href, label, icon: Icon, active }) => (
                <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    className={`flex items-center rounded-xl transition-all touch-manipulation ${
                        collapsed ? "justify-center p-3" : "px-4 py-3"
                    } ${
                        active
                            ? "bg-gradient-to-r from-pink-heart/25 to-red-primary/15 text-white border border-pink-heart/40 shadow-lg shadow-pink-heart/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                >
                    <Icon
                        className={`w-5 h-5 shrink-0 ${active ? "text-pink-heart" : ""} ${collapsed ? "" : "mr-3"}`}
                    />
                    {!collapsed && <span className="font-medium text-sm">{label}</span>}
                </Link>
            ))}
        </nav>
    );
}
