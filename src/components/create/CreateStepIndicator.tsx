"use client";

const STEPS = [
    {
        label: "Basics",
        current: "bg-gradient-to-r from-pink-heart to-red-primary shadow-lg shadow-pink-heart/50",
        done: "bg-pink-heart shadow-pink-heart/30",
        upcoming: "bg-pink-heart/30 border border-pink-heart/50",
    },
    {
        label: "Photos",
        current: "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/40",
        done: "bg-emerald-500 shadow-emerald-500/30",
        upcoming: "bg-emerald-500/25 border border-emerald-400/45",
    },
    {
        label: "Theme",
        current: "bg-gradient-to-r from-violet-400 to-purple-500 shadow-lg shadow-violet-500/40",
        done: "bg-violet-500 shadow-violet-500/30",
        upcoming: "bg-violet-500/25 border border-violet-400/45",
    },
    {
        label: "Publish",
        current: "bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40",
        done: "bg-amber-500 shadow-amber-500/30",
        upcoming: "bg-amber-500/25 border border-amber-400/45",
    },
] as const;

type Props = {
    step: number;
};

export default function CreateStepIndicator({ step }: Props) {
    return (
        <div
            className="flex items-center gap-2 shrink-0"
            aria-label={`Step ${step} of 4`}
        >
            {STEPS.map((config, index) => {
                const i = index + 1;
                const isCurrent = step === i;
                const isDone = step > i;
                const dotClass = isCurrent
                    ? config.current
                    : isDone
                      ? config.done
                      : config.upcoming;

                return (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div
                            className={`h-3 rounded-full transition-all duration-300 ${dotClass} ${
                                isCurrent ? "w-10 sm:w-12" : "w-6 sm:w-8"
                            }`}
                            title={config.label}
                        />
                        <span
                            className={`hidden sm:block text-[9px] font-bold uppercase tracking-wider ${
                                isCurrent
                                    ? "text-white"
                                    : isDone
                                      ? "text-gray-400"
                                      : "text-gray-500"
                            }`}
                        >
                            {config.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
