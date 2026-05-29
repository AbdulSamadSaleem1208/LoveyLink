import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard } from "lucide-react";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";
import { isOwnerEmail, isAdminRole } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: adminRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    const isOwner = isOwnerEmail(user.email);

    if (!isOwner && !isAdminRole(adminRole?.role)) {
        redirect("/dashboard");
    }

    return (
        <div
            data-admin
            className="min-h-screen flex bg-black text-white"
        >
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,0,51,0.12)_0%,_transparent_50%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(219,39,119,0.08)_0%,_transparent_50%)]" />

            <aside className="relative z-10 w-64 min-h-screen flex-shrink-0 flex flex-col border-r border-white/10 bg-zinc-950/95 backdrop-blur-xl">
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-red-primary/50">
                            <Image src="/logo.png" alt="LoveyLink" fill className="object-cover" />
                        </div>
                        <div>
                            <p className="font-bold text-white group-hover:text-red-primary transition-colors">
                                LoveyLink
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-red-primary font-semibold">
                                Admin
                            </p>
                        </div>
                    </Link>
                    <p className="text-xs text-gray-500 mt-3 truncate">{user.email}</p>
                </div>

                <AdminSidebarNav />

                <div className="mt-auto p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Exit to App
                    </Link>
                    <AdminSignOutButton />
                </div>
            </aside>

            <main className="relative z-10 flex-1 p-6 md:p-10 overflow-y-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
