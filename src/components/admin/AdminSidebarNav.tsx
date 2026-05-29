"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, CreditCard } from "lucide-react";

const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users, exact: false },
    { href: "/admin/payments", label: "Payments", icon: CreditCard, exact: false },
];

export default function AdminSidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="mt-6 px-4 space-y-2">
            {links.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                            active
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`}
                    >
                        <Icon className="w-5 h-5 mr-3 shrink-0" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
