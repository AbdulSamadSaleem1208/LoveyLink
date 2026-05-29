import { format, subDays, startOfDay } from "date-fns";

export type ChartPoint = { label: string; value: number };

/** Group rows by day for the last N days (oldest → newest). */
export function buildDailySeries(
    rows: { created_at: string }[],
    days = 14
): ChartPoint[] {
    const today = startOfDay(new Date());
    const series: ChartPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const day = subDays(today, i);
        const label = format(day, "MMM d");
        const nextDay = subDays(today, i - 1);
        const count = rows.filter((r) => {
            const d = new Date(r.created_at);
            return d >= day && d < nextDay;
        }).length;
        series.push({ label, value: count });
    }

    return series;
}

export function countByField(
    rows: { status: string }[],
    keys: string[]
): ChartPoint[] {
    return keys.map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: rows.filter((r) => r.status === key).length,
    }));
}
