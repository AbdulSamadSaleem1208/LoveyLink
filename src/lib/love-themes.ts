export type LoveThemePreset = {
    id: string;
    name: string;
    primary: string;
    gradient: string;
    emoji: string;
};

export const LOVE_THEME_PRESETS: LoveThemePreset[] = [
    {
        id: "blush",
        name: "Blush Romance",
        primary: "#FF6B9D",
        gradient: "linear-gradient(135deg, #FF6B9D 0%, #FF8FAB 50%, #FFB3C6 100%)",
        emoji: "💗",
    },
    {
        id: "rose-gold",
        name: "Rose Gold",
        primary: "#E11D48",
        gradient: "linear-gradient(135deg, #BE123C 0%, #FB7185 50%, #FECDD3 100%)",
        emoji: "🌹",
    },
    {
        id: "sunset",
        name: "Sunset Love",
        primary: "#F97316",
        gradient: "linear-gradient(135deg, #EA580C 0%, #FB923C 50%, #FDE68A 100%)",
        emoji: "🌅",
    },
    {
        id: "lavender",
        name: "Lavender Dream",
        primary: "#A855F7",
        gradient: "linear-gradient(135deg, #7C3AED 0%, #C084FC 50%, #E9D5FF 100%)",
        emoji: "💜",
    },
    {
        id: "ocean",
        name: "Ocean Heart",
        primary: "#2563EB",
        gradient: "linear-gradient(135deg, #1D4ED8 0%, #60A5FA 50%, #BAE6FD 100%)",
        emoji: "💙",
    },
    {
        id: "midnight",
        name: "Midnight Passion",
        primary: "#DB2777",
        gradient: "linear-gradient(135deg, #831843 0%, #DB2777 50%, #F472B6 100%)",
        emoji: "✨",
    },
    {
        id: "cherry",
        name: "Cherry Blossom",
        primary: "#EC4899",
        gradient: "linear-gradient(135deg, #DB2777 0%, #F9A8D4 50%, #FDF2F8 100%)",
        emoji: "🌸",
    },
    {
        id: "classic",
        name: "Classic Red",
        primary: "#DC2626",
        gradient: "linear-gradient(135deg, #991B1B 0%, #EF4444 50%, #FCA5A5 100%)",
        emoji: "❤️",
    },
];

export function getThemeByPrimary(color: string) {
    return LOVE_THEME_PRESETS.find((t) => t.primary.toLowerCase() === color.toLowerCase());
}
