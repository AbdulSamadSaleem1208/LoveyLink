import { Trash2, Loader2 } from "lucide-react";

interface DeletePageButtonProps {
    pageId: string;
    pageTitle: string;
    onDeleteRequest: (id: string, title: string) => void;
    isDeleting: boolean;
}

export default function DeletePageButton({ pageId, pageTitle, onDeleteRequest, isDeleting }: DeletePageButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteRequest(pageId, pageTitle);
            }}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600/80 text-gray-300 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
            title="Delete this page"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
