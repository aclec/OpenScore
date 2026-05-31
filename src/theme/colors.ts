// JS palette mirroring the uniwind tokens in global.css.
// Used where a raw color value is needed (drawn icons, dynamic styles) rather
// than a className. Keep in sync with global.css @theme.

import { Platform, useColorScheme } from "react-native";

export type Palette = {
    accent: string;
    accentShadow: string;
    bg: string;
    surface: string;
    elevated: string;
    ink: string;
    ink2: string;
    muted: string;
    faint: string;
    line: string;
    lineStrong: string;
    keyMuted: string;
    draft: string;
    danger: string;
    /** Fixed navy used for the history "Reprendre" button in both themes. */
    night: string;
    cream: string;
};

export const palette: Record<"light" | "dark", Palette> = {
    light: {
        accent: "#2563EB",
        accentShadow: "rgba(37,99,235,0.35)",
        bg: "#FFFFFF",
        surface: "#FFFFFF",
        elevated: "#FAFAFB",
        ink: "#0B1020",
        ink2: "#475569",
        muted: "#94A3B8",
        faint: "#CBD5E1",
        line: "rgba(15,23,42,0.07)",
        lineStrong: "rgba(15,23,42,0.12)",
        keyMuted: "#F1F5F9",
        draft: "rgba(37,99,235,0.05)",
        danger: "#D93B1E",
        night: "#0B1020",
        cream: "#FFF3E6",
    },
    dark: {
        accent: "#60A5FA",
        accentShadow: "rgba(96,165,250,0.45)",
        bg: "#0B0E1A",
        surface: "#14182A",
        elevated: "#1A1F36",
        ink: "#F1F5F9",
        ink2: "#CBD5E1",
        muted: "#94A3B8",
        faint: "#475569",
        line: "rgba(255,255,255,0.07)",
        lineStrong: "rgba(255,255,255,0.14)",
        keyMuted: "#1A1F36",
        draft: "rgba(96,165,250,0.09)",
        danger: "#F4633A",
        // night / cream are fixed surfaces: identical in both themes (mirrors --color-night/--color-cream).
        night: "#0B1020",
        cream: "#FFF3E6",
    },
};

/** Reactive palette for the current system color scheme. */
export function useColors(): Palette {
    const scheme = useColorScheme();
    return palette[scheme === "dark" ? "dark" : "light"];
}

/** Serif display face (the italic accents in headings / round numbers). */
export const SERIF = Platform.select({ ios: "Georgia", default: "serif" }) as string;

/** Tabular figures so score columns stay aligned. */
export const TABULAR = { fontVariant: ["tabular-nums" as const] };
