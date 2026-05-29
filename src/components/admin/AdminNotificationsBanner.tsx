"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import {
    markAdminNotificationRead,
    markAllAdminNotificationsRead,
} from "@/app/admin/notifications/actions";
import { useRouter } from "next/navigation";

export type AdminNotification = {
    id: string;
    type: string;
    user_email: string | null;
    message: string;
    created_at: string;
};

export default function AdminNotificationsBanner({
    notifications,
}: {
    notifications: AdminNotification[];
}) {
    const router = useRouter();
    const [items, setItems] = useState(notifications);
    const [dismissing, setDismissing] = useState<string | null>(null);

    if (!items.length) return null;

    const dismissOne = async (id: string) => {
        setDismissing(id);
        const result = await markAdminNotificationRead(id);
        setDismissing(null);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        setItems((prev) => prev.filter((n) => n.id !== id));
        router.refresh();
    };

    const dismissAll = async () => {
        setDismissing("all");
        const result = await markAllAdminNotificationsRead();
        setDismissing(null);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        setItems([]);
        router.refresh();
    };

    return (
        <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Premium alerts ({items.length})
                </p>
                {items.length > 1 && (
                    <button
                        type="button"
                        onClick={dismissAll}
                        disabled={dismissing === "all"}
                        className="text-xs text-gray-400 hover:text-white"
                    >
                        Dismiss all
                    </button>
                )}
            </div>
            {items.map((n) => (
                <div
                    key={n.id}
                    className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
                    role="alert"
                >
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-amber-200">{n.message}</p>
                        <p className="text-xs text-amber-400/80 mt-1">
                            {new Date(n.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => dismissOne(n.id)}
                        disabled={dismissing === n.id}
                        aria-label="Dismiss"
                        className="shrink-0 text-amber-400/80 hover:text-white p-1"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
