import { Pressable, Text } from "react-native";

import { TABULAR } from "@/theme/colors";

type Variant = "default" | "op" | "primary";

type Props = {
    label: React.ReactNode;
    onPress: () => void;
    variant?: Variant;
    wide?: boolean;
    /** Stretch to the row height (landscape side pad) instead of a fixed 50px. */
    fill?: boolean;
    fontSize?: number;
    fontWeight?: "500" | "600" | "700";
    /** Spoken label — required when `label` is a symbol or node a screen reader can't read. */
    a11yLabel?: string;
};

const BG: Record<Variant, string> = {
    primary: "bg-accent",
    op: "bg-keymuted dark:bg-keymuted-dark",
    default: "bg-surface dark:bg-surface-dark",
};

/** A single calculator key. */
export function CalcKey({ label, onPress, variant = "default", wide, fill, fontSize = 24, fontWeight = "500", a11yLabel }: Props) {
    const text = variant === "primary" ? "text-white" : "text-ink dark:text-ink-dark";
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={a11yLabel ?? (typeof label === "string" ? label : undefined)}
            className={`${fill ? "h-full min-h-[40px]" : "h-[50px]"} items-center justify-center rounded-xl active:opacity-80 ${BG[variant]}`}
            style={({ pressed }) => ({ flex: wide ? 2 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] })}
        >
            {typeof label === "string" ? (
                <Text
                    className={text}
                    maxFontSizeMultiplier={1.4}
                    style={[TABULAR, { fontSize, fontWeight }]}
                >
                    {label}
                </Text>
            ) : (
                label
            )}
        </Pressable>
    );
}
