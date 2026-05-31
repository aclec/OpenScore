// Text helpers: tabular figures and the serif display face.

import { Text, type TextProps } from "react-native";

import { SERIF, TABULAR } from "@/theme/colors";

/**
 * Text with tabular (monospaced) figures — for scores and totals.
 * Caps font scaling so large Dynamic Type can't overflow the fixed-width score
 * columns; callers can override via `maxFontSizeMultiplier`.
 */
export function Num({ style, ...rest }: TextProps) {
    return (
        <Text
            maxFontSizeMultiplier={1.4}
            {...rest}
            style={[TABULAR, style]}
        />
    );
}

/** Italic serif display text — the editorial accents in headings. */
export function Serif({ style, ...rest }: TextProps) {
    return (
        <Text
            {...rest}
            style={[{ fontFamily: SERIF, fontStyle: "italic" }, style]}
        />
    );
}
