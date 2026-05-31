import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { DEFAULT_RULE, GAMES, getRule, isDefault, ruleCapLabel } from "@/games";
import type { GameRule } from "@/games";
import { useColors } from "@/theme/colors";

import { Num } from "../ui/Txt";
import { Check } from "../ui/icons";

/** Games listed alphabetically — case-sensitive, numerals compared by value (numeric). */
const SORTED_GAMES = [...GAMES].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "case" }));

/** "250/manche · 3–6 j." style summary line for a rule. */
function ruleMeta(rule: GameRule): string {
    const range = rule.maxPlayers !== rule.minPlayers ? `${rule.minPlayers}–${rule.maxPlayers}` : `${rule.minPlayers}`;
    return `${ruleCapLabel(rule)} · ${range} j.`;
}

/** A single game row in the picker sheet — name only, with a check when selected. */
function GameRow({ name, selected, onPress }: { name: string; selected: boolean; onPress: () => void }) {
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

function Segment({ title, meta, selected, onPress }: { title: string; meta: string; selected: boolean; onPress: () => void }) {
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

/**
 * Game selector: two segments — "Défaut" (free counter) and "Jeux". Tapping "Jeux"
 * opens a modal listing the real games; the segment then shows the chosen game.
 */
export function GamePicker({ ruleId, onSelect }: { ruleId: string; onSelect: (id: string) => void }) {
    const [open, setOpen] = useState(false);
    const onDefault = isDefault(ruleId);
    const selectedGame = onDefault ? null : getRule(ruleId);

    const pick = (id: string) => {
        onSelect(id);
        setOpen(false);
    };

    return (
        <View>
            <View className="flex-row gap-2">
                <Segment
                    title={DEFAULT_RULE.name}
                    meta="Compteur libre"
                    selected={onDefault}
                    onPress={() => onSelect(DEFAULT_RULE.id)}
                />
                <Segment
                    title={selectedGame ? selectedGame.name : "Jeux"}
                    meta={selectedGame ? ruleMeta(selectedGame) : "Choisir un jeu"}
                    selected={!onDefault}
                    onPress={() => setOpen(true)}
                />
            </View>
            <Text className="mt-2.5 text-[13px] leading-[18px] text-muted">{getRule(ruleId).description}</Text>

            <Modal
                visible={open}
                transparent
                animationType="slide"
                onRequestClose={() => setOpen(false)}
                statusBarTranslucent
            >
                <Pressable
                    className="flex-1 justify-end bg-night/40"
                    onPress={() => setOpen(false)}
                >
                    <Pressable
                        onPress={() => {}}
                        className="rounded-t-[24px] bg-surface px-3 pb-safe-offset-4 pt-2.5 dark:bg-surface-dark"
                    >
                        <View className="mx-auto mb-1 mt-1 h-1 w-9 rounded-full bg-line-strong dark:bg-line-strong-dark" />
                        <Text className="px-2 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">Choisir un jeu</Text>
                        {SORTED_GAMES.map((g) => (
                            <GameRow
                                key={g.id}
                                name={g.name}
                                selected={g.id === ruleId}
                                onPress={() => pick(g.id)}
                            />
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
