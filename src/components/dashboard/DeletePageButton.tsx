"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteLovePage } from "@/app/dashboard/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function DeletePageButton({ pageId, pageTitle }: { pageId: string, pageTitle: string }) {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);

        try {
            const result = await deleteLovePage(pageId);

            if (result?.error) {
                toast.error(result.error);
                setLoading(false);
                setIsModalOpen(false);
            } else {
                toast.success("Page deleted successfully");

                // Close modal first
                setIsModalOpen(false);
                setLoading(false);

                // Refresh to update the page list
                router.refresh();
            }
        } catch (error) {
            console.error("Client Delete Error:", error);
            toast.error("Failed to connect to server");
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
                disabled={loading}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600/80 text-gray-300 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                title="Delete this page"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>

            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={pageTitle}
                loading={loading}
            />
        </>
    );
}
