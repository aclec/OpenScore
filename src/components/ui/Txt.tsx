// Text helpers: tabular figures and the display face.

import { Text, type TextProps } from "react-native";

import { DISPLAY, TABULAR } from "@/theme/colors";

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

/** Display text — screen titles. Pair with tight tracking at large sizes. */
export function Display({ style, ...rest }: TextProps) {
    return (
        <Text
            {...rest}
            style={[DISPLAY, style]}
        />
    );
}
