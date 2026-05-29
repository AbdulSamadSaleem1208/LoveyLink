"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, CreditCard } from "lucide-react";

const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users, exact: false },
    { href: "/admin/payments", label: "Payments", icon: CreditCard, exact: false },
];

type Props = {
    onNavigate?: () => void;
};

export default function AdminSidebarNav({ onNavigate }: Props) {
    const pathname = usePathname();

    return (
        <nav className="mt-2 lg:mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
            {links.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={`flex items-center px-4 py-3.5 rounded-xl transition-all touch-manipulation ${
                            active
                                ? "bg-gradient-to-r from-red-primary/30 to-pink-hot/20 text-white border border-red-primary/40 shadow-lg shadow-red-900/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Icon className={`w-5 h-5 mr-3 shrink-0 ${active ? "text-red-primary" : ""}`} />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
