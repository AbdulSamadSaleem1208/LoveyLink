"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Loader2, CreditCard } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { approvePayment, rejectPayment, getPaymentRequests } from "./actions";
import AdminFilterBar from "@/components/admin/AdminFilterBar";

interface PaymentRequest {
    id: string;
    user_id: string;
    amount: number;
    trx_id: string;
    status: string;
    created_at: string;
    users: {
        email: string;
        full_name: string;
    };
}

const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "revoked", label: "Revoked" },
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "amount_desc", label: "Amount high → low" },
    { value: "amount_asc", label: "Amount low → high" },
];

function statusBadge(status: string) {
    switch (status) {
        case "pending":
            return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        case "approved":
            return "bg-green-500/20 text-green-400 border-green-500/30";
        case "rejected":
            return "bg-red-500/20 text-red-400 border-red-500/30";
        case "revoked":
            return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        default:
            return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sort, setSort] = useState("newest");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const result = await getPaymentRequests();

        if (result.error) {
            toast.error(result.error || "Failed to fetch payments");
            setPayments([]);
        } else {
            setPayments((result.data as PaymentRequest[]) || []);
        }
        setLoading(false);
    };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        let list = payments.filter((p) => {
            const matchesSearch =
                !q ||
                p.trx_id.toLowerCase().includes(q) ||
                p.users?.email?.toLowerCase().includes(q) ||
                p.users?.full_name?.toLowerCase().includes(q);

            const matchesStatus = statusFilter === "all" || p.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        list = [...list].sort((a, b) => {
            switch (sort) {
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case "amount_desc":
                    return b.amount - a.amount;
                case "amount_asc":
                    return a.amount - b.amount;
                case "newest":
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return list;
    }, [payments, search, statusFilter, sort]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            pending: 0,
            approved: 0,
            rejected: 0,
            revoked: 0,
        };
        payments.forEach((p) => {
            if (counts[p.status] !== undefined) counts[p.status]++;
        });
        return counts;
    }, [payments]);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setProcessingId(id);

        try {
            const result =
                action === "approve" ? await approvePayment(id) : await rejectPayment(id);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success(`Payment ${action}d successfully`);
            await fetchPayments();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Action failed";
            toast.error(message);
        } finally {
            setProcessingId(null);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setSort("newest");
    };

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-red-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl space-y-8">
            <div>
                <div className="flex items-center gap-2 text-red-primary mb-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                        Payments
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white">Payment Approvals</h1>
                <p className="text-gray-400 mt-2">
                    Easypaisa manual verification — PKR 500 / 30 days premium
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                    [
                        ["pending", "Pending", "amber"],
                        ["approved", "Approved", "green"],
                        ["rejected", "Rejected", "red"],
                        ["revoked", "Revoked", "gray"],
                    ] as const
                ).map(([key, label, color]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() =>
                            setStatusFilter(statusFilter === key ? "all" : key)
                        }
                        className={`rounded-xl border p-3 text-left transition-all ${
                            statusFilter === key
                                ? "border-red-primary/50 bg-red-primary/10 ring-1 ring-red-primary/30"
                                : "border-white/10 bg-zinc-900/50 hover:bg-white/5"
                        }`}
                    >
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                        <p
                            className={`text-2xl font-bold mt-1 ${
                                color === "amber"
                                    ? "text-amber-400"
                                    : color === "green"
                                      ? "text-green-400"
                                      : color === "red"
                                        ? "text-red-400"
                                        : "text-gray-400"
                            }`}
                        >
                            {statusCounts[key] ?? 0}
                        </p>
                    </button>
                ))}
            </div>

            <AdminFilterBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search TRX ID, email, or name…"
                status={statusFilter}
                onStatusChange={setStatusFilter}
                statusOptions={STATUS_OPTIONS}
                sort={sort}
                onSortChange={setSort}
                sortOptions={SORT_OPTIONS}
                resultCount={filtered.length}
                totalCount={payments.length}
                onClear={clearFilters}
            />

            <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-black/40">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                    User
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                    TRX ID
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                        {payments.length === 0
                                            ? "No payment requests yet."
                                            : "No payments match your filters."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">
                                                {payment.users?.full_name || "Unknown"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {payment.users?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-amber-400/90">
                                            {payment.trx_id}
                                        </td>
                                        <td className="px-6 py-4 text-white">
                                            PKR {payment.amount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDistanceToNow(
                                                new Date(payment.created_at),
                                                { addSuffix: true }
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${statusBadge(payment.status)}`}
                                            >
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {payment.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(payment.id, "approve")
                                                        }
                                                        disabled={
                                                            !!processingId &&
                                                            processingId !== payment.id
                                                        }
                                                        aria-label="Approve payment"
                                                        className="inline-flex p-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 disabled:opacity-40"
                                                    >
                                                        {processingId === payment.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(payment.id, "reject")
                                                        }
                                                        disabled={
                                                            !!processingId &&
                                                            processingId !== payment.id
                                                        }
                                                        aria-label="Reject payment"
                                                        className="inline-flex p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-40"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
