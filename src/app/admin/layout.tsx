import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    const isOwner = isOwnerEmail(user.email);

    if (!isOwner && !isAdminRole(adminRole?.role)) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-red-400">LoveyLink Admin</h1>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                </div>

                <AdminSidebarNav />

                <div className="mt-auto p-4 border-t border-gray-800 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Exit to App
                    </Link>
                    <AdminSignOutButton />
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
