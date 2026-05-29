"use client";

import { useState } from "react";
import { Heart as HeartIcon, Check as CheckIcon, Trash2 as TrashIcon, LayoutGrid as GridIcon, Clock as ClockIcon, Filter as FilterIcon } from "lucide-react";
import Link from "next/link";
import DeletePageButton from "./DeletePageButton";
import { deleteLovePage } from "@/app/dashboard/actions";
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
    const [view, setView] = useState<'all' | 'recent'>('all');
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        ids: string[];
        title: string;
        isBulk: boolean;
    }>({ ids: [], title: "", isBulk: false });

    const router = useRouter();

    const filteredPages = view === 'recent'
        ? [...initialPages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)
        : initialPages;

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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
                toast.success(modalConfig.isBulk ? `Deleted ${result.count} pages` : "Page deleted");
                if (modalConfig.isBulk) {
                    setSelectionMode(false);
                    setSelectedIds([]);
                }
                setIsModalOpen(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete pages");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={`space-y-6 transition-all duration-300 ${isModalOpen ? 'opacity-40 pointer-events-none scale-[0.99] blur-[2px]' : 'opacity-100'}`}>
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-zinc-900/80 to-zinc-950/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-pink-heart/15 shadow-lg shadow-pink-heart/5">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => { setView('all'); setSelectionMode(false); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center ${view === 'all' && !selectionMode ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <GridIcon className="w-4 h-4 mr-2" />
                            All Pages
                        </button>
                        <button
                            onClick={() => { setView('recent'); setSelectionMode(false); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center ${view === 'recent' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ClockIcon className="w-4 h-4 mr-2" />
                            Recent
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {selectionMode ? (
                            <>
                                <span className="text-sm text-red-500 font-medium mr-2">{selectedIds.length} selected</span>
                                <button
                                    onClick={() => setSelectedIds(initialPages.map(p => p.id))}
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => { setSelectionMode(false); setSelectedIds([]); }}
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => openDeleteModal(selectedIds, `${selectedIds.length} Selected Pages`, true)}
                                    disabled={selectedIds.length === 0 || loading}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-900/40 transition-all disabled:opacity-50 flex items-center"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete Selected
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setSelectionMode(true)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                                >
                                    <FilterIcon className="w-4 h-4 mr-2" />
                                    Select & Manage
                                </button>
                                <button
                                    onClick={() => openDeleteModal(initialPages.map(p => p.id), "All Pages", true)}
                                    className="px-4 py-2 text-sm text-red-500 hover:text-red-400 transition-colors flex items-center"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete All
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPages.map((page) => (
                        <div
                            key={page.id}
                            onClick={() => selectionMode && toggleSelection(page.id)}
                            className={`bg-gradient-to-br from-zinc-900/90 to-black/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-300 group relative cursor-pointer 
                                ${selectionMode ? (selectedIds.includes(page.id) ? 'border-pink-heart ring-2 ring-pink-heart/30 bg-pink-heart/5' : 'border-white/10 opacity-70 scale-[0.98]') : 'border-white/10 hover:border-pink-heart/50 hover:shadow-pink-heart/10 hover:scale-[1.02]'}`}
                        >
                            {!selectionMode && (
                                <DeletePageButton
                                    pageId={page.id}
                                    pageTitle={page.title}
                                    onDeleteRequest={(id, title) => openDeleteModal([id], title, false)}
                                    isDeleting={loading && modalConfig.ids.includes(page.id)}
                                />
                            )}

                            {selectionMode && (
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.includes(page.id) ? 'bg-red-500 border-red-500' : 'border-white/20'}`}>
                                    {selectedIds.includes(page.id) && <CheckIcon className="w-4 h-4 text-white" />}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 bg-pink-heart/10 rounded-full flex items-center justify-center text-pink-heart group-hover:bg-pink-heart group-hover:text-white transition-colors">
                                    <HeartIcon className="w-6 h-6 fill-current" />
                                </div>
                                {page.published ? (
                                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                                        Published
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                                        Draft
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{page.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">For {page.recipient_name}</p>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <Link
                                    href={page.published ? `/lp/${page.slug}` : `/dashboard/success/${page.id}`}
                                    onClick={(e) => selectionMode && e.preventDefault()}
                                    className="flex-1 text-center text-sm font-medium text-gray-300 hover:text-white py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    {page.published ? 'View' : 'Preview'}
                                </Link>
                                <Link href={`/dashboard/success/${page.id}`} onClick={(e) => selectionMode && e.preventDefault()} className="flex-1 text-center text-sm font-medium text-gray-300 hover:text-white py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    QR Code
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
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
