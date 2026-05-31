import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { getRule } from "@/games";
import { createGame, todayLabel } from "@/lib/game";
import { startGame } from "@/store/gameStore";
import { useHistory } from "@/store/useGame";
import { useColors } from "@/theme/colors";

import { PrimaryButton } from "../ui/PrimaryButton";
import { Num, Serif } from "../ui/Txt";
import { GamePicker } from "./GamePicker";
import { AddPlayerButton, Field, PlayerRow } from "./parts";

/** Clamp the player list to `[min, max]`, keeping existing names. */
function clamp(players: string[], min: number, max: number): string[] {
    const next = players.slice(0, max);
    while (next.length < min) next.push("");
    return next;
}

export function NewGame() {
    const router = useRouter();
    const c = useColors();
    const history = useHistory();

    const [name, setName] = useState("");
    const [ruleId, setRuleId] = useState("defaut");
    const [players, setPlayers] = useState(() => clamp([], getRule("defaut").minPlayers, getRule("defaut").maxPlayers));
    const rule = getRule(ruleId);

    const changeRule = (id: string) => {
        const r = getRule(id);
        setRuleId(id);
        setPlayers((p) => clamp(p, r.minPlayers, r.maxPlayers));
    };

    const addPlayer = () => setPlayers((p) => (p.length < rule.maxPlayers ? [...p, ""] : p));
    const removePlayer = (i: number) => setPlayers((p) => (p.length > rule.minPlayers ? p.filter((_, idx) => idx !== i) : p));

    const start = () => {
        startGame(createGame({ name, gameRuleId: ruleId, players }));
        router.push("/game");
    };

    return (
        <View className="flex-1 bg-bg dark:bg-bg-dark">
            <ScrollView
                className="flex-1"
                contentContainerClassName="pt-safe-offset-3 pb-6"
                keyboardShouldPersistTaps="handled"
            >
                <View className="px-6 pt-3">
                    <View className="mb-3.5 flex-row items-center justify-end">
                        <Pressable
                            onPress={() => router.push("/history")}
                            accessibilityRole="button"
                            accessibilityLabel={`Historique, ${history.length} ${history.length > 1 ? "parties" : "partie"}`}
                            className="flex-row items-center gap-1.5 rounded-full bg-keymuted px-2.5 py-1.5 active:opacity-70 dark:bg-keymuted-dark"
                        >
                            <Text className="text-xs font-semibold text-ink dark:text-ink-dark">Historique</Text>
                            <Num className="text-xs font-bold text-muted">{history.length}</Num>
                        </Pressable>
                    </View>
                    <Text className="text-[46px] leading-[46px]">
                        <Serif
                            style={{ fontStyle: "normal" }}
                            className="text-ink dark:text-ink-dark"
                        >
                            Nouvelle{" "}
                        </Serif>
                        <Serif className="text-accent">partie.</Serif>
                    </Text>
                </View>

                <View className="gap-6 px-6 pb-3 pt-5">
                    <Field label="Nom">
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            accessibilityLabel="Nom de la partie"
                            placeholder={todayLabel()}
                            placeholderTextColor={c.muted}
                            style={{
                                borderBottomWidth: 1.5,
                                borderColor: c.line,
                                paddingVertical: 10,
                                fontSize: 17,
                                fontWeight: "500",
                                color: c.ink,
                            }}
                        />
                    </Field>

                    <Field label="Jeu">
                        <GamePicker
                            ruleId={ruleId}
                            onSelect={changeRule}
                        />
                    </Field>

                    <Field label="Joueurs">
                        <View>
                            {players.map((p, i) => (
                                <PlayerRow
                                    key={i}
                                    index={i}
                                    value={p}
                                    last={i === players.length - 1}
                                    onChange={(v) => setPlayers((arr) => arr.map((x, idx) => (idx === i ? v : x)))}
                                    onRemove={players.length > rule.minPlayers ? () => removePlayer(i) : undefined}
                                />
                            ))}
                        </View>
                        <AddPlayerButton
                            onPress={addPlayer}
                            disabled={players.length >= rule.maxPlayers}
                        />
                    </Field>
                </View>
            </ScrollView>

            <View className="px-4 pb-safe-offset-4 pt-3">
                <PrimaryButton onPress={start}>Démarrer la partie</PrimaryButton>
            </View>
        </View>
    );
}
