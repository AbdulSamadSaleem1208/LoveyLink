"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { Loader2, Download, ExternalLink, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { withQrSourceParam } from "@/lib/qr-url";

export default function QRDisplay({ url, title, message }: { url: string, title: string, message?: string }) {
    const [qrSrc, setQrSrc] = useState<string>("");
    const [mode, setMode] = useState<'link' | 'text'>('link');
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);

    const trackableUrl = withQrSourceParam(url);

    useEffect(() => {
        const data = mode === "link" ? trackableUrl : message || "No message provided";

        QRCode.toDataURL(data, {
            width: 480,
            margin: 2,
            color: {
                dark: "#BE123C",
                light: "#FFF5F8",
            },
            errorCorrectionLevel: "H",
        }).then(setQrSrc);
    }, [trackableUrl, mode, message]);

    // Close actions panel when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        }

        if (showActions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showActions]);

    const handleShare = async () => {
        const data = mode === "link" ? trackableUrl : message || "No message provided";
        const shareData = {
            title: title,
            text: mode === "link" ? `Check out this Love Page: ${title}` : message,
            url: mode === "link" ? trackableUrl : undefined,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(data);
                toast.success(mode === 'link' ? "Link copied to clipboard!" : "Message copied to clipboard!");
            } else {
                throw new Error("Clipboard API not available");
            }
        } catch (err) {
            console.error("Error sharing/copying:", err);
            try {
                const textArea = document.createElement("textarea");
                textArea.value = data;
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        toast.success(mode === 'link' ? "Link copied to clipboard!" : "Message copied to clipboard!");
                    } else {
                        toast.error("Failed to copy to clipboard");
                    }
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    toast.error("Failed to copy to clipboard");
                }
                document.body.removeChild(textArea);
            } catch (fallbackError) {
                console.error("Fallback clipboard failed:", fallbackError);
                toast.error("Could not share or copy link");
            }
        }
    };

    if (!qrSrc) return <Loader2 className="animate-spin h-8 w-8 text-red-primary" />;

    return (
        <div className="flex flex-col items-center space-y-5" ref={actionsRef}>
            {/* QR Code — always visible */}
            <div className="relative w-fit">
                <div
                    className="absolute -inset-[3px] rounded-[1.35rem] opacity-70 blur-[2px]"
                    style={{
                        background:
                            "linear-gradient(135deg, #FF6B9D 0%, #FF0033 45%, #DB2777 100%)",
                    }}
                    aria-hidden
                />
                <div className="relative rounded-[1.25rem] bg-gradient-to-br from-white via-rose-50/95 to-pink-50 p-5 shadow-[0_10px_40px_rgba(255,107,157,0.22)] ring-1 ring-pink-light/40">
                    <div className="rounded-xl bg-white/95 p-3 shadow-inner ring-1 ring-pink-heart/15">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={qrSrc}
                            alt={`QR Code for ${title}`}
                            className="w-64 h-64 md:w-80 md:h-80 rounded-lg"
                        />
                    </div>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-hot/90">
                        Scan to share
                    </p>
                </div>
            </div>

            {/* Toggle button to show/hide actions */}
            <button
                onClick={() => setShowActions((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setShowActions((prev) => !prev);
                }}
                aria-expanded={showActions}
                aria-controls="qr-actions-panel"
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-heart/60 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                    showActions
                        ? "bg-zinc-800/90 border border-pink-heart/40 hover:border-pink-heart/70 hover:bg-zinc-800"
                        : "bg-button-gradient shadow-lg shadow-pink-heart/25 hover:opacity-90"
                }`}
            >
                {showActions ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Actions
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        Show Actions
                    </>
                )}
            </button>

            {/* Collapsible Actions Panel */}
            <div
                id="qr-actions-panel"
                role="region"
                aria-label="QR Code actions"
                className={`w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out ${
                    showActions ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col items-center space-y-4 pt-3 pb-1 rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-4 mt-1">
                    {/* Mode Toggle */}
                    <div className="flex w-full max-w-xs p-1 rounded-xl bg-zinc-800/80 border border-white/10">
                        <button
                            onClick={() => setMode("link")}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-heart/50 ${
                                mode === "link"
                                    ? "bg-button-gradient text-white font-bold shadow-md shadow-pink-heart/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Link to Page
                        </button>
                        <button
                            onClick={() => setMode("text")}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-heart/50 ${
                                mode === "text"
                                    ? "bg-button-gradient text-white font-bold shadow-md shadow-pink-heart/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Message Only
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-gray-200 bg-zinc-800/90 border border-white/15 hover:border-pink-heart/40 hover:bg-pink-heart/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-heart/50"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </button>

                        <a
                            href={qrSrc}
                            download={`love-page-qr-${title}-${mode}.png`}
                            className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-button-gradient shadow-lg shadow-pink-heart/20 hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-heart/50"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download QR
                        </a>

                        {mode === "link" && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-gray-200 bg-zinc-800/90 border border-white/15 hover:border-pink-heart/40 hover:bg-pink-heart/10 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-heart/50"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open Page
                            </a>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 max-w-xs text-center">
                        {mode === "link"
                            ? "Scans directly to your Love Page with music & photos."
                            : "Scans as plain text. The user will see your message immediately."}
                    </p>
                </div>
            </div>
        </div>
    );
}
