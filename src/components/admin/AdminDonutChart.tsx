"use client";

import type { ChartPoint } from "@/lib/admin-analytics";

const COLORS = ["#FF0033", "#DB2777", "#9333EA", "#2563EB", "#059669", "#F59E0B"];

type Props = {
    title: string;
    data: ChartPoint[];
};

export default function AdminDonutChart({ title, data }: Props) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let cumulative = 0;

    const segments = data.map((d, i) => {
        const pct = (d.value / total) * 100;
        const start = cumulative;
        cumulative += pct;
        return { ...d, pct, start, color: COLORS[i % COLORS.length] };
    });

    const gradient = segments
        .map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`)
        .join(", ");

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-8">
                <div
                    className="relative h-36 w-36 shrink-0 rounded-full"
                    style={{
                        background: total > 0 ? `conic-gradient(${gradient})` : "#27272a",
                    }}
                >
                    <div className="absolute inset-4 rounded-full bg-zinc-950 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{total}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total</span>
                    </div>
                </div>
                <ul className="flex-1 space-y-2 w-full">
                    {segments.map((s) => (
                        <li key={s.label} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-300">
                                <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: s.color }}
                                />
                                {s.label}
                            </span>
                            <span className="font-semibold text-white tabular-nums">
                                {s.value}{" "}
                                <span className="text-gray-500 font-normal">
                                    ({Math.round(s.pct)}%)
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
