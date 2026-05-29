"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import UserEditModal, { type AdminUserRow } from "./UserEditModal";
import RevokePremiumButton from "./RevokePremiumButton";
import { formatSubscriptionStatus } from "@/lib/admin";

type Props = {
    users: AdminUserRow[];
};

export default function UsersManagementTable({ users }: Props) {
    const [editing, setEditing] = useState<AdminUserRow | null>(null);

    return (
        <>
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-black/40">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {!users.length ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const status = formatSubscriptionStatus(user.subscription_status);
                                return (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-white">
                                                {user.full_name || "—"}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    user.subscription_status === "active"
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                                                }`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditing(user)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-primary/20 border border-red-primary/40 hover:bg-red-primary/30 transition-colors"
                                                    aria-label={`Edit ${user.email}`}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>
                                                {user.subscription_status === "active" && (
                                                    <RevokePremiumButton userId={user.id} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <UserEditModal user={editing} onClose={() => setEditing(null)} />
        </>
    );
}
