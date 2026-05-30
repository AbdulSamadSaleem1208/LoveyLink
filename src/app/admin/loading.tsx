import { Loader2 } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-red-primary" />
            <p className="text-sm text-gray-500">Loading admin…</p>
        </div>
    );
}
