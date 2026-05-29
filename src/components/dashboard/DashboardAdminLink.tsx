"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function DashboardAdminLink() {
    return (
        <Link
            href="/admin"
            className="flex items-center px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/25 rounded-xl hover:bg-red-600/20 transition-colors"
        >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Admin
        </Link>
    );
}
