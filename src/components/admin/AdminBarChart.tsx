"use client";

import type { ChartPoint } from "@/lib/admin-analytics";

type Props = {
    title: string;
    subtitle?: string;
    data: ChartPoint[];
    accent?: "red" | "pink" | "purple" | "blue";
};

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
            <div className="flex items-end justify-between gap-1 h-40">
                {data.map((point) => {
                    const heightPct = (point.value / max) * 100;
                    return (
                        <div
                            key={point.label}
                            className="flex flex-1 flex-col items-center justify-end gap-2 min-w-0"
                        >
                            <span className="text-[10px] font-semibold text-gray-400 tabular-nums">
                                {point.value}
                            </span>
                            <div
                                className={`w-full max-w-[28px] rounded-t-md bg-gradient-to-t ${style.bar} opacity-90 transition-all hover:opacity-100`}
                                style={{ height: `${Math.max(heightPct, 4)}%` }}
                                title={`${point.label}: ${point.value}`}
                            />
                            <span className="text-[9px] text-gray-500 truncate w-full text-center">
                                {point.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
