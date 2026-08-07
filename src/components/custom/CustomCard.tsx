import { Pressable, Text, View } from "react-native";

import { ruleMeta, type GameRule } from "@/games";
import { useColors } from "@/theme/colors";

import { Num } from "../ui/Txt";
import { Chevron } from "../ui/icons";

/** One custom rule in "Mes jeux" — the whole card opens the editor. */
export function CustomCard({ rule, onOpen }: { rule: GameRule; onOpen: () => void }) {
    const c = useColors();
    return (
        <Pressable
            onPress={onOpen}
            accessibilityRole="button"
            accessibilityLabel={`Modifier ${rule.name}, ${ruleMeta(rule)}`}
            className="flex-row items-center gap-3 rounded-2xl bg-surface p-3.5 active:opacity-70 dark:bg-surface-dark"
        >
            <View className="min-w-0 flex-1">
                <Text
                    numberOfLines={1}
                    className="text-[17px] font-bold text-ink dark:text-ink-dark"
                >
                    {rule.name}
                </Text>
                <Num className="mt-0.5 text-[11px] font-semibold uppercase tracking-[1.2px] text-muted">{ruleMeta(rule)}</Num>
                <Text
                    numberOfLines={2}
                    className="mt-1.5 text-[13px] leading-[18px] text-ink2 dark:text-ink2-dark"
                >
                    {rule.description}
                </Text>
            </View>
            <Chevron
                dir="right"
                color={c.faint}
                size={13}
            />
        </Pressable>
    );
}
