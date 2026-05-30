"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    Crown,
    Shield,
    Home,
} from "lucide-react";

type Props = {
    isAdmin: boolean;
    isPremium: boolean;
    onNavigate?: () => void;
};

export default function DashboardSidebarNav({
    isAdmin,
    isPremium,
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
        <nav className="mt-2 lg:mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
            {links.map(({ href, label, icon: Icon, active }) => (
                <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all touch-manipulation ${
                        active
                            ? "bg-gradient-to-r from-pink-heart/25 to-red-primary/15 text-white border border-pink-heart/40 shadow-lg shadow-pink-heart/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Icon
                        className={`w-5 h-5 mr-3 shrink-0 ${active ? "text-pink-heart" : ""}`}
                    />
                    {label}
                </Link>
            ))}
        </nav>
    );
}
