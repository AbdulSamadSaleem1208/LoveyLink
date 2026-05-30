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
                    className="visible-input w-full pl-9 pr-9 py-2.5 rounded-full bg-zinc-800/90 border border-pink-heart/25 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-pink-heart/55 focus:ring-2 focus:ring-pink-heart/30 hover:border-pink-heart/40 transition-colors cursor-text"
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
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                statusFilter === value
                                    ? "bg-gradient-to-r from-pink-heart/35 to-red-primary/25 text-white border border-pink-heart/50 shadow-md shadow-pink-heart/20"
                                    : value === "published"
                                      ? "text-emerald-300/90 border border-emerald-500/25 hover:bg-emerald-500/15 hover:text-emerald-200"
                                      : value === "draft"
                                        ? "text-amber-300/90 border border-amber-500/25 hover:bg-amber-500/15 hover:text-amber-200"
                                        : "text-gray-300 border border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20"
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
