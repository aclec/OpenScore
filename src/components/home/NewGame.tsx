import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, type TextInputProps, View } from "react-native";

import { getRule } from "@/games";
import { createGame, todayLabel } from "@/lib/game";
import { startGame } from "@/store/gameStore";
import { useCustomRules, useHistory } from "@/store/useGame";
import { useColors } from "@/theme/colors";

import { PrimaryButton } from "../ui/PrimaryButton";
import { Display, Num } from "../ui/Txt";
import { GamePicker } from "./GamePicker";
import { AddPlayerButton, Field, PlayerRow } from "./parts";

/** Clamp the player list to `[min, max]`, keeping existing names. */
function clamp(players: string[], min: number, max: number): string[] {
    const next = players.slice(0, max);
    while (next.length < min) next.push("");
    return next;
}

/** Sticky CTA bar height (58 button + 12 top padding) + breathing room. */
const CTA_CLEARANCE = 88;

export function NewGame() {
    const router = useRouter();
    const c = useColors();
    const history = useHistory();
    const customs = useCustomRules();
    const scroll = useRef<ScrollView>(null);

    const [name, setName] = useState("");
    const [ruleId, setRuleId] = useState("defaut");
    const [entered, setEntered] = useState<string[]>([]);
    const rule = getRule(ruleId);

    // Clamped at render, not on selection: a custom rule can be edited from "Mes jeux"
    // while this form stays mounted, so its bounds must always win over the typed rows.
    const players = useMemo(() => clamp(entered, rule.minPlayers, rule.maxPlayers), [entered, rule.minPlayers, rule.maxPlayers]);

    const addPlayer = () => {
        if (players.length < rule.maxPlayers) setEntered([...players, ""]);
    };
    const removePlayer = (i: number) => {
        if (players.length > rule.minPlayers) setEntered(players.filter((_, idx) => idx !== i));
    };

    const start = () => {
        startGame(createGame({ name, gameRuleId: ruleId, players }));
        router.push("/game");
    };

    // Lift the focused field above the keyboard. KeyboardAvoidingView shrinks
    // the form to the space left over, and this scrolls the input that just
    // took focus into it, clearing the sticky "Démarrer" bar.
    const reveal: NonNullable<TextInputProps["onFocus"]> = (e) =>
        scroll.current?.scrollResponderScrollNativeHandleToKeyboard(e.target, CTA_CLEARANCE, true);

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-bg dark:bg-bg-dark"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/*
             * The keyboard stays up for the whole form: filling several player
             * names means tapping between fields and scrolling, and losing the
             * keyboard on every one of those is what made the flow painful.
             * Both inputs keep returnKeyType="done" as the way out.
             */}
            <ScrollView
                ref={scroll}
                className="flex-1"
                contentContainerClassName="pt-safe-offset-3 pb-6"
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 pt-3">
                    <View className="mb-3.5 flex-row items-center justify-end gap-2">
                        <Pressable
                            onPress={() => router.push("/custom")}
                            accessibilityRole="button"
                            accessibilityLabel={`Mes jeux, ${customs.length}`}
                            className="flex-row items-center gap-1.5 rounded-full bg-keymuted px-2.5 py-1.5 active:opacity-70 dark:bg-keymuted-dark"
                        >
                            <Text className="text-xs font-semibold text-ink dark:text-ink-dark">Mes jeux</Text>
                            <Num className="text-xs font-bold text-muted">{customs.length}</Num>
                        </Pressable>
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
                    <Text className="text-[42px] leading-[46px] tracking-[-1.6px]">
                        <Display className="text-ink dark:text-ink-dark">Nouvelle </Display>
                        <Display className="text-accent">partie.</Display>
                    </Text>
                </View>

                <View className="gap-6 px-6 pb-3 pt-5">
                    <Field label="Nom">
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            onFocus={reveal}
                            accessibilityLabel="Nom de la partie"
                            placeholder={todayLabel()}
                            placeholderTextColor={c.muted}
                            returnKeyType="done"
                            autoCapitalize="sentences"
                            style={{
                                borderBottomWidth: 1.5,
                                borderColor: c.lineStrong,
                                paddingVertical: 12,
                                fontSize: 17,
                                fontWeight: "500",
                                color: c.ink,
                            }}
                        />
                    </Field>

                    <Field label="Jeu">
                        <GamePicker
                            ruleId={ruleId}
                            onSelect={setRuleId}
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
                                    onChange={(v) => setEntered(players.map((x, idx) => (idx === i ? v : x)))}
                                    onFocus={reveal}
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

            <View className="border-t border-line bg-bg px-4 pb-safe-offset-4 pt-3 dark:border-line-dark dark:bg-bg-dark">
                <PrimaryButton onPress={start}>Démarrer la partie</PrimaryButton>
            </View>
        </KeyboardAvoidingView>
    );
}
