import { formatDistanceToNow } from "date-fns";
import { QrCode, Smartphone } from "lucide-react";

export type QrScanActivityItem = {
    id: string;
    scanned_at: string;
    scanner_device: string | null;
    pageTitle: string;
    pageSlug: string;
};

type Props = {
    scans: QrScanActivityItem[];
    totalScans: number;
    scansToday: number;
};

export default function AdminQrScanActivity({ scans, totalScans, scansToday }: Props) {
    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black p-6 shadow-xl shadow-purple-500/10 h-full flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <div className="flex items-center gap-2 text-purple-300 mb-1">
                        <QrCode className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Live QR activity
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Who scanned your pages</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Each row is someone opening a love page from a QR code
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-white tabular-nums">{totalScans}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">All time</p>
                    <p className="text-xs text-purple-300 mt-2 font-semibold">
                        {scansToday} today
                    </p>
                </div>
            </div>

            {scans.length ? (
                <ul className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
                    {scans.map((scan) => (
                        <li
                            key={scan.id}
                            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <Smartphone className="h-4 w-4 text-purple-300" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-white truncate">
                                    {scan.pageTitle}
                                </p>
                                <p className="text-xs text-gray-500 truncate font-mono">
                                    /lp/{scan.pageSlug}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                    {scan.scanner_device || "Unknown device"}
                                </p>
                            </div>
                            <span className="text-[10px] text-gray-500 shrink-0 tabular-nums">
                                {formatDistanceToNow(new Date(scan.scanned_at), {
                                    addSuffix: true,
                                })}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 rounded-xl border border-dashed border-purple-500/25 bg-purple-500/5">
                    <QrCode className="h-10 w-10 text-purple-400/50 mb-3" />
                    <p className="text-sm text-gray-400">No QR scans yet</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                        When someone scans a published page QR, it will show up here with the page
                        name and time.
                    </p>
                </div>
            )}
        </div>
    );
}
