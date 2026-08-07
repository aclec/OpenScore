import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { DEFAULT_RULE, GAMES, getRule, isDefault, ruleMeta } from "@/games";
import type { GameRule } from "@/games";
import { useCustomRules } from "@/store/useGame";

import { BottomSheet } from "../ui/BottomSheet";
import { GameRow, ManageRow, Segment, SheetSection } from "./pickerParts";

/** Alphabetical — case-sensitive, numerals compared by value (numeric). */
const byName = (a: GameRule, b: GameRule) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "case" });

const SORTED_GAMES = [...GAMES].sort(byName);

/**
 * Game selector: two segments — "Défaut" (free counter) and "Jeux". Tapping "Jeux"
 * opens a modal listing the built-in games plus the user's own; the segment then
 * shows the chosen game.
 */
export function GamePicker({ ruleId, onSelect }: { ruleId: string; onSelect: (id: string) => void }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const customs = useCustomRules();
    const sortedCustoms = useMemo(() => [...customs].sort(byName), [customs]);

    const rule = getRule(ruleId);
    const onDefault = isDefault(ruleId);
    // A custom game deleted from another screen leaves a dangling id: `getRule`
    // already falls back, and the selection follows it back to the free counter.
    const missing = !onDefault && rule.id !== ruleId;
    useEffect(() => {
        if (missing) onSelect(DEFAULT_RULE.id);
    }, [missing, onSelect]);

    const selectedGame = onDefault || missing ? null : rule;

    const pick = (id: string) => {
        onSelect(id);
        setOpen(false);
    };

    const goToCustoms = (path: "/custom" | "/custom/new") => {
        setOpen(false);
        router.push(path);
    };

    return (
        <View>
            <View className="flex-row gap-2">
                <Segment
                    title={DEFAULT_RULE.name}
                    meta="Compteur libre"
                    selected={onDefault || missing}
                    onPress={() => onSelect(DEFAULT_RULE.id)}
                />
                <Segment
                    title={selectedGame ? selectedGame.name : "Jeux"}
                    meta={selectedGame ? ruleMeta(selectedGame) : "Choisir un jeu"}
                    selected={!!selectedGame}
                    onPress={() => setOpen(true)}
                />
            </View>
            <Text className="mt-2.5 text-[13px] leading-[18px] text-muted">{rule.description}</Text>

            <BottomSheet
                visible={open}
                onClose={() => setOpen(false)}
                header={<Text className="px-1 pb-1 pt-1 text-[11px] font-bold uppercase tracking-[1.5px] text-muted">Choisir un jeu</Text>}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {SORTED_GAMES.map((g) => (
                        <GameRow
                            key={g.id}
                            name={g.name}
                            selected={g.id === ruleId}
                            onPress={() => pick(g.id)}
                        />
                    ))}

                    {sortedCustoms.length > 0 && <SheetSection label="Mes jeux" />}
                    {sortedCustoms.map((g) => (
                        <GameRow
                            key={g.id}
                            name={g.name}
                            selected={g.id === ruleId}
                            onPress={() => pick(g.id)}
                        />
                    ))}

                    <ManageRow
                        onPress={() => goToCustoms(sortedCustoms.length ? "/custom" : "/custom/new")}
                        label={sortedCustoms.length ? "Gérer mes jeux" : "Créer mon jeu"}
                        plus={sortedCustoms.length === 0}
                    />
                </ScrollView>
            </BottomSheet>
        </View>
    );
}
