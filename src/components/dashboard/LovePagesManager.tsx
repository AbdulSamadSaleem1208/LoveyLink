"use client";

import { useMemo, useState } from "react";
import {
    Heart as HeartIcon,
    Check as CheckIcon,
    Trash2 as TrashIcon,
    Plus,
} from "lucide-react";
import Link from "next/link";
import DeletePageButton from "./DeletePageButton";
import LovePagesToolbar, {
    type StatusFilter,
    type SortKey,
} from "./LovePagesToolbar";
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

    return (
        <>
            <div
                className={`space-y-6 transition-all duration-300 ${isModalOpen ? "opacity-40 pointer-events-none" : ""}`}
            >
                <LovePagesToolbar
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sort={sort}
                    onSortChange={setSort}
                    resultCount={filteredPages.length}
                    totalCount={initialPages.length}
                />

                <div className="flex flex-wrap items-center justify-end gap-2">
                    {selectionMode ? (
                        <>
                            <span className="text-sm text-gray-400 mr-1">
                                {selectedIds.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedIds(initialPages.map((p) => p.id))}
                                className="text-sm text-gray-400 hover:text-white px-2"
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectionMode(false);
                                    setSelectedIds([]);
                                }}
                                className="text-sm text-gray-400 hover:text-white px-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    openDeleteModal(selectedIds, "selected pages", true)
                                }
                                disabled={selectedIds.length === 0 || loading}
                                className="text-sm text-red-400 hover:text-red-300 disabled:opacity-40 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/30"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setSelectionMode(true)}
                            className="text-sm text-gray-500 hover:text-white"
                        >
                            Select multiple
                        </button>
                    )}
                </div>

                {filteredPages.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] py-20 px-6 text-center">
                        <HeartIcon className="w-10 h-10 text-pink-heart/50 mx-auto mb-4" />
                        <p className="text-white font-medium mb-1">No pages found</p>
                        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                            {initialPages.length === 0
                                ? "Create your first love page to get started."
                                : "Try another search or filter."}
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-button-gradient text-white text-sm font-semibold hover:opacity-90"
                        >
                            <Plus className="w-4 h-4" />
                            Create page
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-4">
                        {filteredPages.map((page) => (
                            <article
                                key={page.id}
                                onClick={() => selectionMode && toggleSelection(page.id)}
                                className={`group relative flex flex-col rounded-2xl border p-5 transition-all duration-200 ${
                                    selectionMode
                                        ? selectedIds.includes(page.id)
                                            ? "border-pink-heart/50 bg-pink-heart/5 cursor-pointer"
                                            : "border-white/10 opacity-80 cursor-pointer"
                                        : "border-white/10 bg-zinc-900/50 hover:border-pink-heart/30 hover:shadow-lg hover:shadow-pink-heart/5"
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
                                        className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            selectedIds.includes(page.id)
                                                ? "bg-pink-heart border-pink-heart"
                                                : "border-white/25"
                                        }`}
                                    >
                                        {selectedIds.includes(page.id) && (
                                            <CheckIcon className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                )}

                                <div className="flex items-start justify-between gap-2 mb-4">
                                    <div className="h-11 w-11 rounded-xl bg-pink-heart/10 flex items-center justify-center text-pink-heart">
                                        <HeartIcon className="w-5 h-5 fill-current" />
                                    </div>
                                    <span
                                        className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                            page.published
                                                ? "text-green-400 bg-green-500/10"
                                                : "text-amber-300/90 bg-amber-500/10"
                                        }`}
                                    >
                                        {page.published ? "Live" : "Draft"}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
                                    {page.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    For {page.recipient_name || "—"}
                                </p>

                                <div className="mt-auto flex gap-2 pt-4 border-t border-white/5">
                                    <Link
                                        href={
                                            page.published
                                                ? `/lp/${page.slug}`
                                                : `/dashboard/success/${page.id}`
                                        }
                                        onClick={(e) => selectionMode && e.preventDefault()}
                                        className="flex-1 text-center text-sm py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        {page.published ? "View" : "Preview"}
                                    </Link>
                                    <Link
                                        href={`/dashboard/success/${page.id}`}
                                        onClick={(e) => selectionMode && e.preventDefault()}
                                        className="flex-1 text-center text-sm py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        QR
                                    </Link>
                                </div>
                            </article>
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
