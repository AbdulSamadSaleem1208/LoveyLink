import Link from "next/link";
import { Heart } from "lucide-react";

export default function LovePageNotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <Heart className="h-16 w-16 text-red-primary/40 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
            <p className="text-gray-400 max-w-md mb-8">
                This love page may have been removed, is still a draft, or the link might be incorrect.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-red-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
                Go to LoveyLink Home
            </Link>
        </div>
    );
}
