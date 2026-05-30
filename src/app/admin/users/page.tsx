import { createClient } from "@supabase/supabase-js";
import UsersManagementTable from "@/components/admin/UsersManagementTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, email, full_name, subscription_status, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

    return (
        <div className="max-w-6xl space-y-8">
            <div>
                <div className="flex items-center gap-2 text-red-primary mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                        User management
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white">Users</h1>
                <p className="text-gray-400 mt-2">
                    Manage accounts, premium status, and payments — not for creating love pages
                </p>
                {(users?.length ?? 0) >= 500 && (
                    <p className="text-amber-300/90 text-sm mt-2">
                        Showing the 500 most recently joined users. Use search to find others.
                    </p>
                )}
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    Failed to load users: {error.message}
                </div>
            )}

            <UsersManagementTable users={users ?? []} />
        </div>
    );
}
