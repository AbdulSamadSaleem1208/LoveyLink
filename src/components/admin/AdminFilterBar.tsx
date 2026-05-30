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

const inputClass =
    "w-full py-3 px-4 rounded-xl bg-zinc-800 border border-white/20 text-white text-base placeholder:text-gray-400 caret-red-primary focus:ring-2 focus:ring-red-primary/60 focus:border-red-primary/50 outline-none shadow-inner";

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
    const activeStatusLabel =
        statusOptions.find((o) => o.value === status)?.label ?? status;

    return (
        <div className="rounded-2xl border border-white/15 bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                    <label
                        htmlFor="admin-filter-search"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                            aria-hidden
                        />
                        <input
                            id="admin-filter-search"
                            type="search"
                            enterKeyHint="search"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className={`${inputClass} pl-11 pr-11`}
                            style={{ WebkitTextFillColor: "#ffffff" }}
                        />
                        {search.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onSearchChange("")}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    {search.trim() !== "" && (
                        <p className="text-sm text-gray-300">
                            Searching for:{" "}
                            <span className="font-semibold text-white break-all">
                                &ldquo;{search.trim()}&rdquo;
                            </span>
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto lg:min-w-[280px]">
                    <div className="flex-1 min-w-[140px] space-y-2">
                        <label
                            htmlFor="admin-filter-status"
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
                        >
                            Status
                        </label>
                        <div className="relative flex items-center">
                            <SlidersHorizontal
                                className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none"
                                aria-hidden
                            />
                            <select
                                id="admin-filter-status"
                                value={status}
                                onChange={(e) => onStatusChange(e.target.value)}
                                aria-label="Filter by status"
                                className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                            >
                                {statusOptions.map((o) => (
                                    <option key={o.value} value={o.value} className="bg-zinc-900 text-white">
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 min-w-[140px] space-y-2">
                        <label
                            htmlFor="admin-filter-sort"
                            className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
                        >
                            Sort
                        </label>
                        <select
                            id="admin-filter-sort"
                            value={sort}
                            onChange={(e) => onSortChange(e.target.value)}
                            aria-label="Sort order"
                            className={`${inputClass} cursor-pointer appearance-none`}
                        >
                            {sortOptions.map((o) => (
                                <option key={o.value} value={o.value} className="bg-zinc-900 text-white">
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {hasFilters && onClear && (
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={onClear}
                                className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-medium text-white border border-white/20 bg-white/5 hover:bg-white/10"
                            >
                                <X className="h-4 w-4" />
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                <p className="text-gray-400">
                    Showing{" "}
                    <span className="text-white font-semibold">{resultCount}</span> of{" "}
                    <span className="text-gray-300">{totalCount}</span> total
                </p>
                {status !== "all" && (
                    <p className="text-gray-400">
                        Status:{" "}
                        <span className="text-amber-300 font-medium">{activeStatusLabel}</span>
                    </p>
                )}
            </div>
        </div>
    );
}
