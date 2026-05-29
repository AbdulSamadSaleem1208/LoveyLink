"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import UserEditModal, { type AdminUserRow } from "./UserEditModal";
import RevokePremiumButton from "./RevokePremiumButton";
import AdminFilterBar from "./AdminFilterBar";
import { formatSubscriptionStatus } from "@/lib/admin";

type Props = {
    users: AdminUserRow[];
};

const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Premium (active)" },
    { value: "free", label: "Free" },
    { value: "past_due", label: "Past due" },
    { value: "canceled", label: "Canceled" },
    { value: "other", label: "Other / unset" },
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name_asc", label: "Name A → Z" },
    { value: "name_desc", label: "Name Z → A" },
    { value: "email_asc", label: "Email A → Z" },
];

function normalizeStatus(status: string | null): string {
    if (!status) return "other";
    if (["active", "free", "past_due", "canceled"].includes(status)) return status;
    return "other";
}

export default function UsersManagementTable({ users }: Props) {
    const [editing, setEditing] = useState<AdminUserRow | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sort, setSort] = useState("newest");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        let list = users.filter((user) => {
            const matchesSearch =
                !q ||
                user.email.toLowerCase().includes(q) ||
                (user.full_name?.toLowerCase().includes(q) ?? false);

            const normalized = normalizeStatus(user.subscription_status);
            const matchesStatus =
                statusFilter === "all" || normalized === statusFilter;

            return matchesSearch && matchesStatus;
        });

        list = [...list].sort((a, b) => {
            switch (sort) {
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case "name_asc":
                    return (a.full_name || a.email).localeCompare(b.full_name || b.email);
                case "name_desc":
                    return (b.full_name || b.email).localeCompare(a.full_name || a.email);
                case "email_asc":
                    return a.email.localeCompare(b.email);
                case "newest":
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return list;
    }, [users, search, statusFilter, sort]);

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setSort("newest");
    };

    return (
        <>
            <AdminFilterBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by name or email…"
                status={statusFilter}
                onStatusChange={setStatusFilter}
                statusOptions={STATUS_OPTIONS}
                sort={sort}
                onSortChange={setSort}
                sortOptions={SORT_OPTIONS}
                resultCount={filtered.length}
                totalCount={users.length}
                onClear={clearFilters}
            />

            <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/50 backdrop-blur-sm mt-4">
                <div className="overflow-x-auto">
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
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                                        {users.length === 0
                                            ? "No users in the database yet."
                                            : "No users match your filters."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => {
                                    const status = formatSubscriptionStatus(
                                        user.subscription_status
                                    );
                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-white">
                                                    {user.full_name || "—"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
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
                                                <div className="flex items-center justify-end gap-2 flex-wrap">
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
            </div>

            <UserEditModal user={editing} onClose={() => setEditing(null)} />
        </>
    );
}
