"use client";

import type { ChartPoint } from "@/lib/admin-analytics";

type Props = {
    title: string;
    subtitle?: string;
    data: ChartPoint[];
    accent?: "red" | "pink" | "purple" | "blue";
};

const CHART_HEIGHT_PX = 120;

const accents = {
    red: { bar: "from-red-500 to-red-700", glow: "shadow-red-500/20" },
    pink: { bar: "from-pink-500 to-rose-600", glow: "shadow-pink-500/20" },
    purple: { bar: "from-purple-500 to-violet-600", glow: "shadow-purple-500/20" },
    blue: { bar: "from-blue-500 to-cyan-600", glow: "shadow-blue-500/20" },
};

export default function AdminBarChart({
    title,
    subtitle,
    data,
    accent = "red",
}: Props) {
    const max = Math.max(...data.map((d) => d.value), 1);
    const style = accents[accent];

    return (
        <div
            className={`rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black p-6 shadow-xl ${style.glow}`}
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className="flex items-end justify-between gap-1 sm:gap-2 min-h-[168px]">
                {data.map((point) => {
                    const barHeightPx =
                        point.value > 0
                            ? Math.max(Math.round((point.value / max) * CHART_HEIGHT_PX), 6)
                            : 2;

                    return (
                        <div
                            key={point.label}
                            className="flex flex-1 flex-col items-center justify-end min-w-0 h-[168px]"
                        >
                            <span className="text-[10px] font-semibold text-gray-400 tabular-nums mb-1 shrink-0">
                                {point.value}
                            </span>
                            <div
                                className="flex-1 w-full flex items-end justify-center min-h-0 mb-1"
                                aria-hidden
                            >
                                <div
                                    className={`w-full max-w-[28px] rounded-t-md bg-gradient-to-t ${style.bar} transition-all hover:brightness-110`}
                                    style={{ height: `${barHeightPx}px` }}
                                    title={`${point.label}: ${point.value}`}
                                />
                            </div>
                            <span className="text-[9px] text-gray-500 truncate w-full text-center shrink-0 leading-tight">
                                {point.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
