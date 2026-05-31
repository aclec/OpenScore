import { Pressable, Text, View } from "react-native";

import { Chevron } from "./icons";

type Props = {
    children: string;
    onPress: () => void;
    disabled?: boolean;
    /** Show the trailing arrow (default true). */
    arrow?: boolean;
};

/** Full-width accent call-to-action. */
export function PrimaryButton({ children, onPress, disabled, arrow = true }: Props) {
    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={children}
            accessibilityState={{ disabled: !!disabled }}
            className={`h-[58px] flex-row items-center justify-center gap-2.5 rounded-2xl ${
                disabled ? "bg-keymuted dark:bg-keymuted-dark" : "bg-accent active:opacity-90"
            }`}
            style={({ pressed }) => ({ transform: [{ scale: pressed && !disabled ? 0.97 : 1 }] })}
        >
            <Text className={`text-base font-semibold ${disabled ? "text-muted" : "text-white"}`}>{children}</Text>
            {arrow && (
                <View className="ml-0.5">
                    <Chevron
                        dir="right"
                        color={disabled ? "#94A3B8" : "#FFFFFF"}
                        size={13}
                        weight={1.8}
                    />
                </View>
            )}
        </Pressable>
    );
}
