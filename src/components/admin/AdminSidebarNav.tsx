"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, CreditCard, PlusCircle, Heart } from "lucide-react";

const adminLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users, exact: false },
    { href: "/admin/payments", label: "Payments", icon: CreditCard, exact: false },
];

const creatorLinks = [
    { href: "/dashboard", label: "My love pages", icon: Heart, exact: false },
    { href: "/create", label: "Create love page", icon: PlusCircle, exact: false },
];

type Props = {
    onNavigate?: () => void;
};

export default function AdminSidebarNav({ onNavigate }: Props) {
    const pathname = usePathname();

    const renderLink = (
        href: string,
        label: string,
        Icon: typeof LayoutDashboard,
        exact: boolean,
        variant: "admin" | "creator"
    ) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const activeClass =
            variant === "admin"
                ? "bg-gradient-to-r from-red-primary/30 to-pink-hot/20 text-white border border-red-primary/40 shadow-lg shadow-red-900/20"
                : "bg-gradient-to-r from-pink-heart/20 to-emerald-500/10 text-white border border-pink-heart/30";

        return (
            <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all touch-manipulation ${
                    active ? activeClass : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
                <Icon className={`w-5 h-5 mr-3 shrink-0 ${active ? "text-pink-heart" : ""}`} />
                {label}
            </Link>
        );
    };

    return (
        <nav className="mt-2 lg:mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-red-primary/90">
                Administration
            </p>
            {adminLinks.map(({ href, label, icon, exact }) =>
                renderLink(href, label, icon, exact, "admin")
            )}

            <p className="px-4 pt-5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Create pages
            </p>
            {creatorLinks.map(({ href, label, icon, exact }) =>
                renderLink(href, label, icon, exact, "creator")
            )}
        </nav>
    );
}
