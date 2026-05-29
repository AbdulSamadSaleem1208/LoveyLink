"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { approvePayment, rejectPayment, getPaymentRequests } from "./actions";
import { BackButton } from "@/components/ui/back-button";

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

function statusBadge(status: string) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "approved":
            return "bg-green-100 text-green-800";
        case "rejected":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

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

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-red-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-center gap-4">
                <BackButton className="text-gray-500 hover:text-gray-900" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Approvals</h1>
                    <p className="text-sm text-gray-500 mt-1">Easypaisa manual verification (PKR 500 / 30 days)</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 font-medium">User</th>
                            <th className="px-6 py-3 font-medium">TRX ID</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No payment requests yet.
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {payment.users?.full_name || "Unknown"}
                                        </div>
                                        <div className="text-sm text-gray-500">{payment.users?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-amber-700">
                                        {payment.trx_id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">PKR {payment.amount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge(payment.status)}`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {payment.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(payment.id, "approve")}
                                                    disabled={!!processingId && processingId !== payment.id}
                                                    aria-label="Approve payment"
                                                    className="inline-flex p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === payment.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(payment.id, "reject")}
                                                    disabled={!!processingId && processingId !== payment.id}
                                                    aria-label="Reject payment"
                                                    className="inline-flex p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === payment.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <X className="w-4 h-4" />
                                                    )}
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
    );
}
