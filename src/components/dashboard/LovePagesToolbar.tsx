"use client";

import { Search, X } from "lucide-react";

export type StatusFilter = "all" | "published" | "draft";
export type SortKey = "newest" | "oldest" | "title";

type Props = {
    search: string;
    onSearchChange: (v: string) => void;
    statusFilter: StatusFilter;
    onStatusChange: (v: StatusFilter) => void;
    sort: SortKey;
    onSortChange: (v: SortKey) => void;
    resultCount: number;
    totalCount: number;
};

const STATUS_PILLS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "published", label: "Live" },
    { value: "draft", label: "Drafts" },
];

export default function LovePagesToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sort,
    onSortChange,
    resultCount,
    totalCount,
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search pages…"
                    className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-heart/40 focus:ring-1 focus:ring-pink-heart/30"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {STATUS_PILLS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onStatusChange(value)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                statusFilter === value
                                    ? "bg-pink-heart/20 text-pink-heart border border-pink-heart/40"
                                    : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">
                        <span className="text-white font-medium">{resultCount}</span>
                        <span className="text-gray-600"> / {totalCount}</span>
                    </span>
                    <select
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value as SortKey)}
                        aria-label="Sort pages"
                        className="py-1.5 pl-3 pr-8 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none focus:border-pink-heart/40"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="title">A–Z</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
