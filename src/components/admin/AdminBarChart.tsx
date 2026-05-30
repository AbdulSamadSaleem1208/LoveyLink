"use client";

import { useState } from "react";
import type { ChartPoint } from "@/lib/admin-analytics";

type Props = {
    title: string;
    subtitle?: string;
    data: ChartPoint[];
    accent?: "red" | "pink" | "purple" | "blue";
    /** X-axis description shown below the chart */
    xAxisLabel?: string;
    /** Y-axis description shown beside the chart */
    yAxisLabel?: string;
    /** Word used in hover tooltip, e.g. "signups" */
    valueUnit?: string;
};

const CHART_HEIGHT_PX = 120;

const accents = {
    red: { bar: "from-red-500 to-red-700", glow: "shadow-red-500/20", tooltip: "border-red-500/40" },
    pink: { bar: "from-pink-500 to-rose-600", glow: "shadow-pink-500/20", tooltip: "border-pink-500/40" },
    purple: {
        bar: "from-purple-500 to-violet-600",
        glow: "shadow-purple-500/20",
        tooltip: "border-purple-500/40",
    },
    blue: { bar: "from-blue-500 to-cyan-600", glow: "shadow-blue-500/20", tooltip: "border-blue-500/40" },
};

export default function AdminBarChart({
    title,
    subtitle,
    data,
    accent = "red",
    xAxisLabel = "Date",
    yAxisLabel = "Count",
    valueUnit = "total",
}: Props) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const max = Math.max(...data.map((d) => d.value), 1);
    const mid = Math.round(max / 2);
    const style = accents[accent];
    return (
        <div
            className={`rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black p-6 shadow-xl ${style.glow}`}
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
            </div>

            <div className="flex gap-2 sm:gap-3">
                {/* Y-axis scale + label */}
                <div className="flex shrink-0 gap-1.5">
                    <div
                        className="flex flex-col justify-between h-[168px] py-0.5 pr-0.5"
                        aria-hidden
                    >
                        <span className="text-[9px] font-medium text-gray-400 tabular-nums leading-none">
                            {max}
                        </span>
                        <span className="text-[9px] text-gray-500 tabular-nums leading-none">
                            {mid}
                        </span>
                        <span className="text-[9px] text-gray-500 tabular-nums leading-none">0</span>
                    </div>
                    <div className="flex items-center">
                        <span
                            className="text-[9px] font-medium uppercase tracking-wider text-gray-500 [writing-mode:vertical-rl] rotate-180"
                            title={yAxisLabel}
                        >
                            {yAxisLabel}
                        </span>
                    </div>
                </div>

                {/* Chart + X-axis */}
                <div className="flex-1 min-w-0">
                    <div
                        className="relative border-l border-b border-white/15 pl-2 pb-1"
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="flex items-end justify-between gap-1 sm:gap-2 min-h-[168px]">
                            {data.map((point, index) => {
                                const barHeightPx =
                                    point.value > 0
                                        ? Math.max(
                                              Math.round((point.value / max) * CHART_HEIGHT_PX),
                                              6
                                          )
                                        : 2;
                                const isHovered = hoveredIndex === index;

                                return (
                                    <div
                                        key={point.label}
                                        className="relative flex flex-1 flex-col items-center justify-end min-w-0 h-[168px] cursor-pointer group"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onFocus={() => setHoveredIndex(index)}
                                        onBlur={() => setHoveredIndex(null)}
                                        tabIndex={0}
                                        role="graphics-symbol"
                                        aria-label={`${point.label}: ${point.value} ${valueUnit}`}
                                    >
                                        {isHovered && (
                                            <div
                                                className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border bg-zinc-950/95 px-3 py-2 text-center shadow-lg backdrop-blur-sm ${style.tooltip}`}
                                            >
                                                <p className="text-xs font-bold text-white">
                                                    {point.label}
                                                </p>
                                                <p className="text-sm font-semibold text-white tabular-nums mt-0.5">
                                                    {point.value}{" "}
                                                    <span className="text-gray-400 font-normal text-xs">
                                                        {valueUnit}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                        <span
                                            className={`text-[10px] font-semibold tabular-nums mb-1 shrink-0 transition-colors ${
                                                isHovered ? "text-white" : "text-gray-500"
                                            }`}
                                        >
                                            {point.value}
                                        </span>
                                        <div className="flex-1 w-full flex items-end justify-center min-h-0 mb-1">
                                            <div
                                                className={`w-full max-w-[28px] rounded-t-md bg-gradient-to-t ${style.bar} transition-all duration-150 ${
                                                    isHovered
                                                        ? "brightness-125 scale-105 shadow-lg"
                                                        : "opacity-90 group-hover:brightness-110"
                                                }`}
                                                style={{ height: `${barHeightPx}px` }}
                                            />
                                        </div>
                                        <span
                                            className={`text-[9px] truncate w-full text-center shrink-0 leading-tight transition-colors ${
                                                isHovered ? "text-gray-200" : "text-gray-500"
                                            }`}
                                        >
                                            {point.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-gray-500">
                        {xAxisLabel}
                    </p>
                </div>
            </div>

            <p className="mt-3 text-[10px] text-gray-600 text-center">
                Hover over a bar to see the exact count for that day
            </p>
        </div>
    );
}
