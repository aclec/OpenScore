// Rows and segments used by the game picker.

import { Pressable, Text } from "react-native";

import { useColors } from "@/theme/colors";

import { Num } from "../ui/Txt";
import { Check } from "../ui/icons";

/** A single game row in the picker sheet — name only, with a check when selected. */
export function GameRow({ name, selected, onPress }: { name: string; selected: boolean; onPress: () => void }) {
    const c = useColors();
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={name}
            className={`flex-row items-center justify-between rounded-[14px] px-4 py-4 active:bg-keymuted dark:active:bg-keymuted-dark ${
                selected ? "bg-accent-soft dark:bg-accent-soft-dark" : ""
            }`}
        >
            <Text className={`text-[17px] font-semibold ${selected ? "text-accent" : "text-ink dark:text-ink-dark"}`}>{name}</Text>
            {selected && (
                <Check
                    color={c.accent}
                    size={15}
                    weight={2.5}
                />
            )}
        </Pressable>
    );
}

export function Segment({ title, meta, selected, onPress }: { title: string; meta: string; selected: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${title}, ${meta}`}
            className={`flex-1 gap-1 rounded-xl border-[1.5px] px-3 py-3.5 ${
                selected ? "border-accent bg-accent-soft dark:bg-accent-soft-dark" : "border-line dark:border-line-dark"
            }`}
        >
            <Text className="text-[15px] font-semibold text-ink dark:text-ink-dark">{title}</Text>
            <Num className="text-[11px] font-medium text-muted">{meta}</Num>
        </Pressable>
    );
}

/** Small uppercase separator between the built-in games and the user's own. */
export function SheetSection({ label }: { label: string }) {
    return <Text className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[1.4px] text-muted">{label}</Text>;
}

/** Dashed row at the bottom of the sheet: leaves for the "Mes jeux" screen. */
export function ManageRow({ onPress, label, plus }: { onPress: () => void; label: string; plus?: boolean }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            className="mt-2 flex-row items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-3.5 active:opacity-70 dark:border-line-dark"
        >
            {plus && <Text className=" text-lg leading-none text-accent">+</Text>}
            <Text className="text-sm font-semibold text-ink dark:text-ink-dark">{label}</Text>
        </Pressable>
    );
}
