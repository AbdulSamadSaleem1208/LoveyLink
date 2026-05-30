"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type MenuLayout = {
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
};

const triggerMd =
    "w-full flex items-center justify-between gap-2 py-3 px-4 rounded-xl bg-zinc-800 border border-white/20 text-white text-base text-left hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-heart/50 focus:border-pink-heart/40 transition-colors";

const triggerSm =
    "flex items-center justify-between gap-2 py-2 pl-3 pr-2 rounded-full bg-zinc-800 border border-white/20 text-white text-sm text-left min-w-[8.5rem] hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-heart/40";

const MENU_Z = 9999;
const ITEM_HEIGHT = 42;
const MENU_PADDING = 12;

function computeMenuLayout(trigger: HTMLElement, optionCount: number): MenuLayout {
    const rect = trigger.getBoundingClientRect();
    const width = Math.max(rect.width, 168);
    const idealHeight = optionCount * ITEM_HEIGHT + MENU_PADDING;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < idealHeight && spaceAbove > spaceBelow;
    const maxHeight = Math.min(idealHeight, Math.max(openUp ? spaceAbove : spaceBelow, 120) - 4);

    if (openUp) {
        return {
            bottom: window.innerHeight - rect.top + gap,
            left: rect.left,
            width,
            maxHeight,
        };
    }

    return {
        top: rect.bottom + gap,
        left: rect.left,
        width,
        maxHeight,
    };
}

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
    const [mounted, setMounted] = useState(false);
    const [menuLayout, setMenuLayout] = useState<MenuLayout | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selected = options.find((o) => o.value === value) ?? options[0];

    const updateMenuLayout = useCallback(() => {
        if (!triggerRef.current) return;
        setMenuLayout(computeMenuLayout(triggerRef.current, options.length));
    }, [options.length]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        updateMenuLayout();
        const onScrollOrResize = () => updateMenuLayout();
        window.addEventListener("resize", onScrollOrResize);
        window.addEventListener("scroll", onScrollOrResize, true);
        return () => {
            window.removeEventListener("resize", onScrollOrResize);
            window.removeEventListener("scroll", onScrollOrResize, true);
        };
    }, [open, updateMenuLayout]);

    useEffect(() => {
        const onPointerDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (rootRef.current?.contains(target)) return;
            const menu = document.getElementById(`${id}-menu`);
            if (menu?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [id]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const triggerClass = size === "sm" ? triggerSm : triggerMd;

    const menu =
        open && menuLayout && mounted
            ? createPortal(
                  <ul
                      id={`${id}-menu`}
                      role="listbox"
                      aria-label={ariaLabel ?? label}
                      style={{
                          position: "fixed",
                          top: menuLayout.top,
                          bottom: menuLayout.bottom,
                          left: menuLayout.left,
                          width: menuLayout.width,
                          maxHeight: menuLayout.maxHeight,
                          zIndex: MENU_Z,
                      }}
                      className="rounded-xl border border-white/20 bg-zinc-900 shadow-2xl py-1.5 overflow-y-auto overscroll-contain"
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
                                      <span className="whitespace-nowrap">{option.label}</span>
                                      {active && (
                                          <Check className="h-4 w-4 text-pink-heart shrink-0" />
                                      )}
                                  </button>
                              </li>
                          );
                      })}
                  </ul>,
                  document.body
              )
            : null;

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
                ref={triggerRef}
                id={id}
                type="button"
                title={selected?.label}
                aria-label={ariaLabel ?? label ?? "Select option"}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => {
                    setOpen((o) => {
                        if (!o) updateMenuLayout();
                        return !o;
                    });
                }}
                className={triggerClass}
            >
                <span className="font-medium truncate min-w-0">{selected?.label}</span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {menu}
        </div>
    );
}
