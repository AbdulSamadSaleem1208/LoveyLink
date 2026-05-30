"use client";

import { Search, X } from "lucide-react";
import DarkSelect from "@/components/ui/DarkSelect";

export type StatusFilter = "all" | "published" | "draft";
export type SortKey = "newest" | "oldest" | "title";

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "title", label: "A–Z" },
];

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
                    className="visible-input w-full pl-9 pr-9 py-2.5 rounded-full bg-zinc-800 border border-white/20 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-heart/40 focus:ring-1 focus:ring-pink-heart/30"
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
                    <span className="text-gray-400">
                        <span className="text-white font-medium">{resultCount}</span>
                        <span className="text-gray-500"> / {totalCount}</span>
                    </span>
                    <DarkSelect
                        size="sm"
                        value={sort}
                        onChange={(v) => onSortChange(v as SortKey)}
                        options={SORT_OPTIONS}
                        ariaLabel="Sort pages"
                    />
                </div>
            </div>
        </div>
    );
}
