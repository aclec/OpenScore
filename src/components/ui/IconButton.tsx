import { Pressable } from "react-native";

type Props = {
    onPress: () => void;
    accessibilityLabel: string;
    children: React.ReactNode;
};

/** 36×36 muted square button (back / menu). hitSlop lifts the tap target past 44px. */
export function IconButton({ onPress, accessibilityLabel, children }: Props) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            hitSlop={8}
            className="h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-keymuted active:opacity-70 dark:bg-keymuted-dark"
        >
            {children}
        </Pressable>
    );
}
