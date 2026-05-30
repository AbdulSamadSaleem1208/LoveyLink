import { createClient } from "@supabase/supabase-js";
import { Users, CreditCard, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, startOfDay, subDays } from "date-fns";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBarChart from "@/components/admin/AdminBarChart";
import AdminDonutChart from "@/components/admin/AdminDonutChart";
import AdminQrScanActivity, { type QrScanActivityItem } from "@/components/admin/AdminQrScanActivity";
import { buildDailySeries } from "@/lib/admin-analytics";

export const dynamic = "force-dynamic";

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: { autoRefreshToken: false, persistSession: false },
        }
    );
}

type RawQrScanRow = {
    id: string;
    scanned_at: string;
    scanner_device: string | null;
    qr_codes: {
        love_pages: { title: string; slug: string } | { title: string; slug: string }[] | null;
    } | null;
};

function mapQrScanRow(raw: RawQrScanRow): QrScanActivityItem | null {
    const nested = raw.qr_codes?.love_pages;
    const page = Array.isArray(nested) ? nested[0] : nested;
    if (!page?.slug) return null;

    return {
        id: raw.id,
        scanned_at: raw.scanned_at,
        scanner_device: raw.scanner_device,
        pageTitle: page.title || "Love page",
        pageSlug: page.slug,
    };
}

export default async function AdminDashboard() {
    const supabaseAdmin = getAdminClient();
    const since = subDays(new Date(), 14).toISOString();

    const [
        { count: userCount },
        { count: pageCount },
        { count: publishedPageCount },
        { count: premiumUserCount },
        { count: qrScanCount },
        { data: qrScanRows },
        { data: recentQrScans },
        { count: pendingPayments },
        { data: recentPayments },
        { data: recentUsers },
        { data: userRows },
        { data: pageRows },
        { count: approvedPayCount },
        { count: rejectedPayCount },
        { count: revokedPayCount },
    ] = await Promise.all([
        supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("love_pages").select("*", { count: "exact", head: true }),
        supabaseAdmin
            .from("love_pages")
            .select("*", { count: "exact", head: true })
            .eq("published", true),
        supabaseAdmin
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("subscription_status", "active"),
        supabaseAdmin.from("qr_scans").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("qr_scans").select("scanned_at").gte("scanned_at", since),
        supabaseAdmin
            .from("qr_scans")
            .select(
                `
                id,
                scanned_at,
                scanner_device,
                qr_codes (
                    love_pages ( title, slug )
                )
            `
            )
            .order("scanned_at", { ascending: false })
            .limit(10),
        supabaseAdmin
            .from("payment_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
        supabaseAdmin
            .from("payment_requests")
            .select("id, status, amount, created_at, trx_id")
            .order("created_at", { ascending: false })
            .limit(6),
        supabaseAdmin
            .from("users")
            .select("email, full_name, created_at")
            .order("created_at", { ascending: false })
            .limit(6),
        supabaseAdmin.from("users").select("created_at").gte("created_at", since),
        supabaseAdmin.from("love_pages").select("created_at").gte("created_at", since),
        supabaseAdmin
            .from("payment_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved"),
        supabaseAdmin
            .from("payment_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "rejected"),
        supabaseAdmin
            .from("payment_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "revoked"),
    ]);

    const signupSeries = buildDailySeries(userRows ?? [], 14);
    const pagesSeries = buildDailySeries(pageRows ?? [], 14);
    const qrScanSeries = buildDailySeries(qrScanRows ?? [], 14, "scanned_at");
    const todayStart = startOfDay(new Date());
    const scansToday = (qrScanRows ?? []).filter(
        (r) => new Date(r.scanned_at) >= todayStart
    ).length;
    const qrScanActivity = (recentQrScans ?? [])
        .map((row) => mapQrScanRow(row as RawQrScanRow))
        .filter((row): row is QrScanActivityItem => row !== null);
    const paymentBreakdown = [
        { name: "pending", value: pendingPayments ?? 0 },
        { name: "approved", value: approvedPayCount ?? 0 },
        { name: "rejected", value: rejectedPayCount ?? 0 },
        { name: "revoked", value: revokedPayCount ?? 0 },
    ].filter((d) => d.value > 0);

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                <div>
                    <div className="flex items-center gap-2 text-red-primary mb-2">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">
                            Control center
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        System Overview
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Users, payments, and platform stats — management only
                    </p>
                </div>
                {pendingPayments ? (
                    <Link
                        href="/admin/payments"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
                    >
                        {pendingPayments} payment{pendingPayments === 1 ? "" : "s"} awaiting review
                    </Link>
                ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard
                    title="Total Users"
                    value={userCount ?? 0}
                    icon={<Users className="w-7 h-7 text-white" />}
                    gradient="from-blue-600/80 to-blue-900/80"
                    glow="shadow-blue-500/10"
                />
                <AdminStatCard
                    title="Premium Users"
                    value={premiumUserCount ?? 0}
                    subtitle="Matches app access"
                    icon={<CreditCard className="w-7 h-7 text-white" />}
                    gradient="from-emerald-600/80 to-emerald-900/80"
                    glow="shadow-emerald-500/10"
                />
                <AdminStatCard
                    title="Published Pages"
                    value={publishedPageCount ?? 0}
                    subtitle={`${pageCount ?? 0} total created`}
                    icon={<Heart className="w-7 h-7 text-white fill-white/20" />}
                    gradient="from-red-600/80 to-rose-900/80"
                    glow="shadow-red-500/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminBarChart
                    title="New signups"
                    subtitle="Last 14 days"
                    data={signupSeries}
                    accent="blue"
                    xAxisLabel="Date (day)"
                    yAxisLabel="New users"
                    valueUnit="signups"
                />
                <AdminBarChart
                    title="Love pages created"
                    subtitle="Last 14 days"
                    data={pagesSeries}
                    accent="red"
                    xAxisLabel="Date (day)"
                    yAxisLabel="Pages created"
                    valueUnit="pages"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AdminBarChart
                        title="QR code scans"
                        subtitle="Last 14 days — someone opened a page from a QR"
                        data={qrScanSeries}
                        accent="purple"
                        xAxisLabel="Date (day)"
                        yAxisLabel="QR scans"
                        valueUnit="scans"
                    />
                </div>
                <AdminQrScanActivity
                    scans={qrScanActivity}
                    totalScans={qrScanCount ?? 0}
                    scansToday={scansToday}
                />
            </div>

            {paymentBreakdown.length > 0 && (
                <AdminDonutChart title="Payment requests by status" data={paymentBreakdown} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityPanel title="Recent signups" href="/admin/users">
                    {recentUsers?.length ? (
                        <ul className="space-y-3">
                            {recentUsers.map((u) => (
                                <li
                                    key={`${u.email}-${u.created_at}`}
                                    className="flex justify-between gap-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0"
                                >
                                    <span className="text-white truncate font-medium">
                                        {u.full_name || u.email}
                                    </span>
                                    <span className="text-gray-500 shrink-0 text-xs">
                                        {formatDistanceToNow(new Date(u.created_at), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No users yet.</p>
                    )}
                </ActivityPanel>

                <ActivityPanel title="Recent payments" href="/admin/payments">
                    {recentPayments?.length ? (
                        <ul className="space-y-3">
                            {recentPayments.map((p) => (
                                <li
                                    key={p.id}
                                    className="flex justify-between gap-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0"
                                >
                                    <span className="text-white">
                                        PKR {p.amount}{" "}
                                        <span className="text-gray-500 font-mono text-xs">
                                            {p.trx_id}
                                        </span>
                                    </span>
                                    <StatusPill status={p.status} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No payments yet.</p>
                    )}
                </ActivityPanel>
            </div>
        </div>
    );
}

function ActivityPanel({
    title,
    href,
    children,
}: {
    title: string;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <Link
                    href={href}
                    className="text-sm text-red-primary hover:text-red-accent font-medium"
                >
                    View all →
                </Link>
            </div>
            {children}
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
        approved: "bg-green-500/20 text-green-400 border-green-500/30",
        pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        rejected: "bg-red-500/20 text-red-400 border-red-500/30",
        revoked: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return (
        <span
            className={`shrink-0 capitalize text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[status] ?? styles.pending}`}
        >
            {status}
        </span>
    );
}
