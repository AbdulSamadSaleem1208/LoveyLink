"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { Loader2, Download, ExternalLink, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function QRDisplay({ url, title, message }: { url: string, title: string, message?: string }) {
    const [qrSrc, setQrSrc] = useState<string>("");
    const [mode, setMode] = useState<'link' | 'text'>('link');
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const data = mode === 'link' ? url : (message || "No message provided");

        QRCode.toDataURL(data, {
            width: 480,
            margin: 2,
            color: {
                dark: "#BE123C",
                light: "#FFF5F8",
            },
            errorCorrectionLevel: "H",
        }).then(setQrSrc);
    }, [url, mode, message]);

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
        const data = mode === 'link' ? url : (message || "No message provided");
        const shareData = {
            title: title,
            text: mode === 'link' ? `Check out this Love Page: ${title}` : message,
            url: mode === 'link' ? url : undefined
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
                onClick={() => setShowActions(prev => !prev)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowActions(prev => !prev); }}
                aria-expanded={showActions}
                aria-controls="qr-actions-panel"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                    backgroundColor: '#0052cc',
                    color: '#ffffff',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#003d99'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#0052cc'; }}
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
                className={`w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out ${showActions ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-col items-center space-y-4 pt-2 pb-1">
                    {/* Mode Toggle */}
                    <div className="flex space-x-2 p-1 rounded-lg" style={{ backgroundColor: '#f0f0f0' }}>
                        <button
                            onClick={() => setMode('link')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${mode === 'link'
                                ? 'bg-white shadow text-gray-900 font-bold'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Link to Page
                        </button>
                        <button
                            onClick={() => setMode('text')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${mode === 'text'
                                ? 'bg-white shadow text-gray-900 font-bold'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Message Only
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            style={{ backgroundColor: '#f0f0f0', color: '#333333' }}
                            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#e0e0e0'; }}
                            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#f0f0f0'; }}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </button>

                        <a
                            href={qrSrc}
                            download={`love-page-qr-${title}-${mode}.png`}
                            className="flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            style={{ backgroundColor: '#0052cc', color: '#ffffff' }}
                            onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#003d99'; }}
                            onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#0052cc'; }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download QR
                        </a>

                        {mode === 'link' && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                style={{ backgroundColor: '#f0f0f0', color: '#333333' }}
                                onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#e0e0e0'; }}
                                onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#f0f0f0'; }}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open Page
                            </a>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-400 max-w-xs text-center">
                        {mode === 'link'
                            ? "Scans directly to your Love Page with music & photos."
                            : "Scans as plain text. The user will see your message immediately."}
                    </p>
                </div>
            </div>
        </div>
    );
}
