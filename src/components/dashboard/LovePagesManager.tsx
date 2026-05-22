"use client";

import { useState } from "react";
import { Heart, Check, Trash2, LayoutGrid, Clock, Filter } from "lucide-react";
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
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const router = useRouter();

    const filteredPages = view === 'recent'
        ? [...initialPages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)
        : initialPages;

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteLovePage(selectedIds);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Deleted ${result.count} pages`);
                setSelectionMode(false);
                setSelectedIds([]);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete pages");
        } finally {
            setLoading(false);
            setIsBulkDeleteModalOpen(false);
        }
    };

    const handleDeleteAll = async () => {
        const allIds = initialPages.map(p => p.id);
        setLoading(true);
        try {
            const result = await deleteLovePage(allIds);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Deleted all ${result.count} pages`);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete all pages");
        } finally {
            setLoading(false);
            setIsBulkDeleteModalOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setView('all'); setSelectionMode(false); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center ${view === 'all' && !selectionMode ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        All Pages
                    </button>
                    <button
                        onClick={() => { setView('recent'); setSelectionMode(false); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center ${view === 'recent' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Recent
                    </button>
                </div>

                <div className="flex items-center gap-2">
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
                                onClick={() => setIsBulkDeleteModalOpen(true)}
                                disabled={selectedIds.length === 0 || loading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-900/40 transition-all disabled:opacity-50 flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Selected
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setSelectionMode(true)}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Select & Manage
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedIds(initialPages.map(p => p.id));
                                    setIsBulkDeleteModalOpen(true);
                                }}
                                className="px-4 py-2 text-sm text-red-500 hover:text-red-400 transition-colors flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
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
                        className={`bg-background-card border rounded-2xl p-6 shadow-sm transition-all group relative cursor-pointer ${selectionMode ? (selectedIds.includes(page.id) ? 'border-red-500 ring-2 ring-red-500/20 bg-red-500/5' : 'border-white/10 opacity-70 scale-[0.98]') : 'border-white/10 hover:border-red-primary/50 hover:scale-[1.01]'}`}
                    >
                        {!selectionMode && <DeletePageButton pageId={page.id} pageTitle={page.title} />}

                        {selectionMode && (
                            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIds.includes(page.id) ? 'bg-red-500 border-red-500' : 'border-white/20'}`}>
                                {selectedIds.includes(page.id) && <Check className="w-4 h-4 text-white" />}
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 bg-red-primary/10 rounded-full flex items-center justify-center text-red-primary group-hover:bg-red-primary group-hover:text-white transition-colors">
                                <Heart className="w-6 h-6 fill-current" />
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
                            <Link href={`/lp/${page.slug}`} onClick={(e) => selectionMode && e.preventDefault()} className="flex-1 text-center text-sm font-medium text-gray-300 hover:text-white py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                View
                            </Link>
                            <Link href={`/dashboard/success/${page.id}`} onClick={(e) => selectionMode && e.preventDefault()} className="flex-1 text-center text-sm font-medium text-gray-300 hover:text-white py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                QR Code
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <DeleteConfirmationModal
                isOpen={isBulkDeleteModalOpen}
                onClose={() => setIsBulkDeleteModalOpen(false)}
                onConfirm={selectedIds.length === initialPages.length ? handleDeleteAll : handleBulkDelete}
                title={selectedIds.length === initialPages.length ? "All Pages" : `${selectedIds.length} Selected Pages`}
                loading={loading}
            />
        </div>
    );
}
