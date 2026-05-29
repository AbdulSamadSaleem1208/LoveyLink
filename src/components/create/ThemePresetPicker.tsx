"use client";

import { motion } from "framer-motion";
import { LOVE_THEME_PRESETS } from "@/lib/love-themes";

type Props = {
    selected: string;
    onSelect: (primary: string) => void;
};

export default function ThemePresetPicker({ selected, onSelect }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LOVE_THEME_PRESETS.map((preset, i) => {
                const isSelected = selected.toLowerCase() === preset.primary.toLowerCase();
                return (
                    <motion.button
                        key={preset.id}
                        type="button"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(preset.primary)}
                        className={`relative rounded-2xl p-3 text-left border-2 transition-all overflow-hidden ${
                            isSelected
                                ? "border-white ring-2 ring-pink-heart/50 shadow-lg shadow-pink-heart/25"
                                : "border-white/10 hover:border-white/30"
                        }`}
                    >
                        <div
                            className="absolute inset-0 opacity-90"
                            style={{ background: preset.gradient }}
                        />
                        <div className="relative z-10">
                            <span className="text-2xl">{preset.emoji}</span>
                            <p className="text-xs font-bold text-white mt-2 drop-shadow-md">
                                {preset.name}
                            </p>
                        </div>
                        {isSelected && (
                            <span className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-white text-pink-heart text-[10px] font-bold flex items-center justify-center">
                                ✓
                            </span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
