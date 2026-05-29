"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export type SortOption = { value: string; label: string };

type Props = {
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    status: string;
    onStatusChange: (value: string) => void;
    statusOptions: { value: string; label: string }[];
    sort: string;
    onSortChange: (value: string) => void;
    sortOptions: SortOption[];
    resultCount: number;
    totalCount: number;
    onClear?: () => void;
};

export default function AdminFilterBar({
    search,
    onSearchChange,
    searchPlaceholder = "Search…",
    status,
    onStatusChange,
    statusOptions,
    sort,
    onSortChange,
    sortOptions,
    resultCount,
    totalCount,
    onClear,
}: Props) {
    const hasFilters = search.trim() !== "" || status !== "all";

    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-4 space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-red-primary outline-none"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 min-w-[140px]">
                        <SlidersHorizontal className="h-4 w-4 text-gray-500 shrink-0" />
                        <select
                            value={status}
                            onChange={(e) => onStatusChange(e.target.value)}
                            aria-label="Filter by status"
                            className="flex-1 py-2.5 px-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:ring-2 focus:ring-red-primary outline-none"
                        >
                            {statusOptions.map((o) => (
                                <option key={o.value} value={o.value} className="bg-zinc-900">
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value)}
                        aria-label="Sort order"
                        className="py-2.5 px-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:ring-2 focus:ring-red-primary outline-none min-w-[160px]"
                    >
                        {sortOptions.map((o) => (
                            <option key={o.value} value={o.value} className="bg-zinc-900">
                                {o.label}
                            </option>
                        ))}
                    </select>
                    {hasFilters && onClear && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-gray-400 border border-white/10 hover:text-white hover:bg-white/5"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>
            <p className="text-xs text-gray-500">
                Showing <span className="text-white font-semibold">{resultCount}</span> of{" "}
                <span className="text-gray-400">{totalCount}</span> total
            </p>
        </div>
    );
}
