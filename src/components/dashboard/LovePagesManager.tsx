"use client";

import { useMemo, useState } from "react";
import {
    Heart as HeartIcon,
    Check as CheckIcon,
    Trash2 as TrashIcon,
    LayoutGrid as GridIcon,
    Clock as ClockIcon,
    Search,
    X,
    FileText,
    Globe,
} from "lucide-react";
import Link from "next/link";
import DeletePageButton from "./DeletePageButton";
import { deleteLovePage } from "@/app/(app)/dashboard/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface Page {
    id: string;
    title: string;
    recipient_name: string;
    published: boolean;
    slug: string;
    created_at: string;
}

type StatusFilter = "all" | "published" | "draft";
type SortKey = "newest" | "oldest" | "title";

export default function LovePagesManager({ initialPages }: { initialPages: Page[] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sort, setSort] = useState<SortKey>("newest");
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        ids: string[];
        title: string;
        isBulk: boolean;
    }>({ ids: [], title: "", isBulk: false });

    const router = useRouter();

    const filteredPages = useMemo(() => {
        const q = search.trim().toLowerCase();

        let list = initialPages.filter((page) => {
            const matchesSearch =
                !q ||
                page.title.toLowerCase().includes(q) ||
                page.recipient_name?.toLowerCase().includes(q) ||
                page.slug.toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "published" && page.published) ||
                (statusFilter === "draft" && !page.published);

            return matchesSearch && matchesStatus;
        });

        list = [...list].sort((a, b) => {
            switch (sort) {
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                case "newest":
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return list;
    }, [initialPages, search, statusFilter, sort]);

    const publishedCount = initialPages.filter((p) => p.published).length;
    const draftCount = initialPages.length - publishedCount;

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const openDeleteModal = (ids: string[], title: string, isBulk: boolean) => {
        setModalConfig({ ids, title, isBulk });
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteLovePage(modalConfig.ids);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    modalConfig.isBulk ? `Deleted ${result.count} pages` : "Page deleted"
                );
                if (modalConfig.isBulk) {
                    setSelectionMode(false);
                    setSelectedIds([]);
                }
                setIsModalOpen(false);
                router.refresh();
            }
        } catch {
            toast.error("Failed to delete pages");
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setSort("newest");
    };

    const hasFilters = search.trim() !== "" || statusFilter !== "all" || sort !== "newest";

    return (
        <>
            <div
                className={`space-y-6 transition-all duration-300 ${isModalOpen ? "opacity-40 pointer-events-none scale-[0.99] blur-[2px]" : "opacity-100"}`}
            >
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Total pages", value: initialPages.length, icon: GridIcon },
                        { label: "Published", value: publishedCount, icon: Globe },
                        { label: "Drafts", value: draftCount, icon: FileText },
                        { label: "Showing", value: filteredPages.length, icon: ClockIcon },
                    ].map(({ label, value, icon: Icon }) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-pink-heart/15 bg-gradient-to-br from-zinc-900/90 to-black/80 p-4"
                        >
                            <Icon className="w-5 h-5 text-pink-heart mb-2" />
                            <p className="text-2xl font-bold text-white">{value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-white/15 bg-zinc-900/80 p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="pages-search"
                                className="text-xs font-semibold uppercase tracking-wider text-gray-300"
                            >
                                Search pages
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                <input
                                    id="pages-search"
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Title, recipient, or link slug…"
                                    className="visible-input block w-full pl-11 pr-10 py-3 rounded-xl text-white text-base bg-zinc-800 border border-white/20 placeholder:text-gray-400"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {search.trim() && (
                                <p className="text-sm text-gray-400">
                                    Filtering:{" "}
                                    <span className="text-white font-medium">
                                        &ldquo;{search.trim()}&rdquo;
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
                            <div className="space-y-2 min-w-[140px]">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value as StatusFilter)
                                    }
                                    className="visible-input w-full py-3 px-3 rounded-xl text-white text-base bg-zinc-800 border border-white/20"
                                >
                                    <option value="all">All</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div className="space-y-2 min-w-[140px]">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                    Sort
                                </label>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value as SortKey)}
                                    className="visible-input w-full py-3 px-3 rounded-xl text-white text-base bg-zinc-800 border border-white/20"
                                >
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                    <option value="title">Title A–Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm text-pink-heart hover:text-pink-light font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Actions toolbar */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-zinc-900/80 to-zinc-950/80 backdrop-blur-md p-4 rounded-2xl border border-pink-heart/15">
                    <p className="text-sm text-gray-400">
                        <span className="text-white font-semibold">{filteredPages.length}</span>{" "}
                        page{filteredPages.length === 1 ? "" : "s"} in view
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectionMode ? (
                            <>
                                <span className="text-sm text-pink-heart font-medium">
                                    {selectedIds.length} selected
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedIds(initialPages.map((p) => p.id))}
                                    className="px-3 py-2 text-sm text-gray-300 hover:text-white"
                                >
                                    Select all
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectionMode(false);
                                        setSelectedIds([]);
                                    }}
                                    className="px-3 py-2 text-sm text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openDeleteModal(
                                            selectedIds,
                                            `${selectedIds.length} pages`,
                                            true
                                        )
                                    }
                                    disabled={selectedIds.length === 0 || loading}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 flex items-center gap-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Delete selected
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setSelectionMode(true)}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5"
                            >
                                Select multiple
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {filteredPages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-pink-heart/25 bg-zinc-900/40 py-16 px-6 text-center">
                        <HeartIcon className="w-12 h-12 text-pink-heart/40 mx-auto mb-4" />
                        <p className="text-white font-semibold mb-1">No pages match</p>
                        <p className="text-sm text-gray-500 mb-6">
                            {initialPages.length === 0
                                ? "Create your first love page to see it here."
                                : "Try a different search or filter."}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm text-pink-heart font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
                        {filteredPages.map((page) => (
                            <div
                                key={page.id}
                                onClick={() => selectionMode && toggleSelection(page.id)}
                                className={`bg-gradient-to-br from-zinc-900/95 to-black/85 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-300 group relative min-h-[220px] flex flex-col ${
                                    selectionMode
                                        ? selectedIds.includes(page.id)
                                            ? "border-pink-heart ring-2 ring-pink-heart/30 bg-pink-heart/5 cursor-pointer"
                                            : "border-white/10 opacity-80 cursor-pointer"
                                        : "border-white/10 hover:border-pink-heart/40 hover:shadow-pink-heart/10"
                                }`}
                            >
                                {!selectionMode && (
                                    <DeletePageButton
                                        pageId={page.id}
                                        pageTitle={page.title}
                                        onDeleteRequest={(id, title) =>
                                            openDeleteModal([id], title, false)
                                        }
                                        isDeleting={
                                            loading && modalConfig.ids.includes(page.id)
                                        }
                                    />
                                )}

                                {selectionMode && (
                                    <div
                                        className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            selectedIds.includes(page.id)
                                                ? "bg-pink-heart border-pink-heart"
                                                : "border-white/20"
                                        }`}
                                    >
                                        {selectedIds.includes(page.id) && (
                                            <CheckIcon className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-pink-heart/10 rounded-2xl flex items-center justify-center text-pink-heart">
                                        <HeartIcon className="w-6 h-6 fill-current" />
                                    </div>
                                    {page.published ? (
                                        <span className="px-2.5 py-1 bg-green-500/15 text-green-400 text-xs font-semibold rounded-full border border-green-500/25">
                                            Live
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/25">
                                            Draft
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 flex-1">
                                    {page.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    For {page.recipient_name || "—"}
                                </p>
                                <p className="text-xs text-gray-600 font-mono truncate mb-4">
                                    /lp/{page.slug}
                                </p>

                                <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
                                    <Link
                                        href={
                                            page.published
                                                ? `/lp/${page.slug}`
                                                : `/dashboard/success/${page.id}`
                                        }
                                        onClick={(e) => selectionMode && e.preventDefault()}
                                        className="flex-1 text-center text-sm font-medium text-white py-2.5 bg-white/5 rounded-xl hover:bg-pink-heart/20 border border-white/10 transition-colors"
                                    >
                                        {page.published ? "View" : "Preview"}
                                    </Link>
                                    <Link
                                        href={`/dashboard/success/${page.id}`}
                                        onClick={(e) => selectionMode && e.preventDefault()}
                                        className="flex-1 text-center text-sm font-medium text-white py-2.5 bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 transition-colors"
                                    >
                                        QR Code
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={modalConfig.title}
                loading={loading}
            />
        </>
    );
}
