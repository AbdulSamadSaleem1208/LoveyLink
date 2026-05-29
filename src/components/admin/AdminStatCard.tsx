import { ReactNode } from "react";

type Props = {
    title: string;
    value: number | string;
    icon: ReactNode;
    gradient: string;
    glow: string;
};

export default function AdminStatCard({ title, value, icon, gradient, glow }: Props) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-lg ${glow}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm border border-white/20">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-white/80">{title}</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                </div>
            </div>
        </div>
    );
}
