"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type DarkSelectOption = { value: string; label: string };

type Props = {
    id?: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: DarkSelectOption[];
    ariaLabel?: string;
    className?: string;
    size?: "sm" | "md";
};

const triggerMd =
    "w-full flex items-center justify-between gap-2 py-3 px-4 rounded-xl bg-zinc-800 border border-white/20 text-white text-base text-left hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-heart/50 focus:border-pink-heart/40 transition-colors";

const triggerSm =
    "flex items-center justify-between gap-2 py-2 pl-3 pr-2 rounded-full bg-zinc-800 border border-white/20 text-white text-sm text-left min-w-[7.5rem] hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-heart/40";

export default function DarkSelect({
    id: idProp,
    label,
    value,
    onChange,
    options,
    ariaLabel,
    className = "",
    size = "md",
}: Props) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value) ?? options[0];

    useEffect(() => {
        const onPointerDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const triggerClass = size === "sm" ? triggerSm : triggerMd;

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2"
                >
                    {label}
                </label>
            )}
            <button
                id={id}
                type="button"
                aria-label={ariaLabel ?? label ?? "Select option"}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={triggerClass}
            >
                <span className="truncate font-medium">{selected?.label}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-label={ariaLabel ?? label}
                    className="absolute z-[100] mt-1.5 w-full min-w-full rounded-xl border border-white/20 bg-zinc-900 shadow-2xl py-1.5 overflow-hidden"
                >
                    {options.map((option) => {
                        const active = option.value === value;
                        return (
                            <li key={option.value} role="option" aria-selected={active}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                                        active
                                            ? "bg-pink-heart/25 text-white font-semibold"
                                            : "text-gray-200 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {active && (
                                        <Check className="h-4 w-4 text-pink-heart shrink-0" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
