import { createClient } from "@supabase/supabase-js";
import { Users, CreditCard, Heart, QrCode, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
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

    const [
        { count: userCount },
        { count: pageCount },
        { count: subCount },
        { count: qrScanCount },
        { data: recentPayments },
        { data: recentUsers },
    ] = await Promise.all([
        supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("love_pages").select("*", { count: "exact", head: true }),
        supabaseAdmin
            .from("subscriptions")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),
        supabaseAdmin.from("qr_scans").select("*", { count: "exact", head: true }),
        supabaseAdmin
            .from("payment_requests")
            .select("id, status, amount, created_at, trx_id")
            .order("created_at", { ascending: false })
            .limit(5),
        supabaseAdmin
            .from("users")
            .select("email, full_name, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={userCount || 0}
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={subCount || 0}
                    icon={<CreditCard className="w-6 h-6 text-green-500" />}
                    bg="bg-green-50"
                />
                <StatCard
                    title="Love Pages Created"
                    value={pageCount || 0}
                    icon={<Heart className="w-6 h-6 text-red-500" />}
                    bg="bg-red-50"
                />
                <StatCard
                    title="Total QR Scans"
                    value={qrScanCount || 0}
                    icon={<QrCode className="w-6 h-6 text-purple-500" />}
                    bg="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityCard title="Recent signups" href="/admin/users">
                    {recentUsers?.length ? (
                        <ul className="space-y-3">
                            {recentUsers.map((u) => (
                                <li
                                    key={`${u.email}-${u.created_at}`}
                                    className="flex justify-between text-sm gap-4"
                                >
                                    <span className="text-gray-900 truncate">
                                        {u.full_name || u.email}
                                    </span>
                                    <span className="text-gray-500 shrink-0 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No users yet.</p>
                    )}
                </ActivityCard>

                <ActivityCard title="Recent payments" href="/admin/payments">
                    {recentPayments?.length ? (
                        <ul className="space-y-3">
                            {recentPayments.map((p) => (
                                <li
                                    key={p.id}
                                    className="flex justify-between text-sm gap-4"
                                >
                                    <span className="text-gray-900">
                                        PKR {p.amount}{" "}
                                        <span className="text-gray-500 font-mono text-xs">
                                            {p.trx_id}
                                        </span>
                                    </span>
                                    <span
                                        className={`shrink-0 capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            p.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : p.status === "pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {p.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No payment requests yet.</p>
                    )}
                </ActivityCard>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    bg,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bg: string;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className={`p-4 rounded-full ${bg} mr-4`}>{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function ActivityCard({
    title,
    href,
    children,
}: {
    title: string;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <Link href={href} className="text-sm text-red-600 hover:text-red-800 font-medium">
                    View all →
                </Link>
            </div>
            {children}
        </div>
    );
}
