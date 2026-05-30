"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateUser, deleteUser } from "@/app/admin/users/actions";
import { useRouter } from "next/navigation";
import { visibleInputClass } from "@/lib/form-input-styles";
import DarkSelect from "@/components/ui/DarkSelect";

export type AdminUserRow = {
    id: string;
    email: string;
    full_name: string | null;
    subscription_status: string | null;
    created_at: string;
};

type Props = {
    user: AdminUserRow | null;
    onClose: () => void;
};

export default function UserEditModal({ user, onClose }: Props) {
    const router = useRouter();
    const [fullName, setFullName] = useState(user?.full_name ?? "");
    const [status, setStatus] = useState(user?.subscription_status ?? "free");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name ?? "");
            setStatus(user.subscription_status ?? "free");
        }
    }, [user]);

    if (!user) return null;

    const handleSave = async () => {
        setLoading(true);
        const result = await updateUser(user.id, {
            full_name: fullName.trim(),
            subscription_status: status,
        });
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("User updated");
        router.refresh();
        onClose();
    };

    const handleDelete = async () => {
        if (
            !confirm(
                `Delete ${user.email}? This removes their love pages and account permanently.`
            )
        ) {
            return;
        }
        setDeleting(true);
        const result = await deleteUser(user.id);
        setDeleting(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("User deleted");
        router.refresh();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div
                className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
                role="dialog"
                aria-labelledby="edit-user-title"
            >
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <h2 id="edit-user-title" className="text-lg font-bold text-white">
                        Edit user
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                        <p className="text-sm text-gray-300 bg-black/40 rounded-lg px-3 py-2 border border-white/10">
                            {user.email}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="full_name" className="block text-xs font-medium text-gray-400 mb-1">
                            Full name
                        </label>
                        <input
                            id="full_name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={visibleInputClass}
                            style={{ WebkitTextFillColor: "#ffffff" }}
                        />
                    </div>
                    <DarkSelect
                        id="sub_status"
                        label="Subscription"
                        value={status ?? "free"}
                        onChange={setStatus}
                        ariaLabel="Subscription status"
                        options={[
                            { value: "free", label: "Free" },
                            { value: "active", label: "Active (Premium)" },
                            { value: "past_due", label: "Past due" },
                            { value: "canceled", label: "Canceled" },
                        ]}
                    />
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || deleting}
                        className="w-full py-2.5 rounded-xl font-bold text-white bg-button-gradient hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save changes
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading || deleting}
                        className="w-full py-2.5 rounded-xl font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Delete user
                    </button>
                </div>
            </div>
        </div>
    );
}
