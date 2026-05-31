import { Pressable, Text } from "react-native";

import type { Player } from "@/lib/types";

import { Num } from "../ui/Txt";

type Props = {
    player: Player;
    isCurrent: boolean;
    value: number | null | undefined;
    /** Live expression preview for the current player. */
    draft: string | null;
    onPress: () => void;
};

/** Quick-switch chip for a player in the round currently being scored. */
export function PlayerChip({ player, isCurrent, value, draft, onPress }: Props) {
    const hasValue = typeof value === "number";
    const display = isCurrent ? (draft && draft !== "" ? draft : "·") : hasValue ? String(value) : "—";
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: isCurrent }}
            accessibilityLabel={`${player.name}, ${hasValue ? value : "pas encore de score"}`}
            className={`flex-row items-center justify-between gap-2 rounded-xl py-2.5 pl-3.5 pr-3 active:opacity-90 ${
                isCurrent ? "bg-accent" : "bg-surface dark:bg-surface-dark"
            }`}
        >
            <Text
                numberOfLines={1}
                className={`flex-1 text-[13px] font-semibold ${isCurrent ? "text-white" : "text-ink dark:text-ink-dark"}`}
            >
                {player.name}
            </Text>
            <Num
                className={`text-[15px] font-bold ${isCurrent ? "text-white" : "text-ink dark:text-ink-dark"}`}
                style={{ opacity: hasValue || isCurrent ? 1 : 0.32 }}
            >
                {display}
            </Num>
        </Pressable>
    );
}
