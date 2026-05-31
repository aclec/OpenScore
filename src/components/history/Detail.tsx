import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { computeTotals } from "@/lib/game";
import { getRule } from "@/games";
import { resume } from "@/store/gameStore";
import { useHistory } from "@/store/useGame";
import { useColors } from "@/theme/colors";

import { IconButton } from "../ui/IconButton";
import { PrimaryButton } from "../ui/PrimaryButton";
import { Num, Serif } from "../ui/Txt";
import { Chevron } from "../ui/icons";

const COL_W = 68;
const ROW_L = 38;

export function Detail({ gameId }: { gameId: string }) {
    const router = useRouter();
    const c = useColors();
    const game = useHistory().find((g) => g.id === gameId);

    if (!game) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <Text className="text-muted">Partie introuvable.</Text>
            </View>
        );
    }

    const rule = getRule(game.gameRuleId);
    const totals = computeTotals(game);
    const winner = [...game.players].sort((a, b) =>
        rule.scoreDirection === "asc" ? totals[b.id] - totals[a.id] : totals[a.id] - totals[b.id]
    )[0];
    const cell = "border-r border-line dark:border-line-dark";
    const onResume = () => {
        if (resume(game.id)) router.navigate("/game");
    };

    return (
        <View className="flex-1 bg-bg dark:bg-bg-dark">
            <View className="border-b border-line px-4 pb-4 pt-safe-offset-2 dark:border-line-dark">
                <View className="flex-row items-center gap-2.5">
                    <IconButton
                        onPress={() => router.back()}
                        accessibilityLabel="Retour"
                    >
                        <Chevron
                            dir="left"
                            color={c.ink}
                            size={13}
                        />
                    </IconButton>
                    <View className="min-w-0 flex-1">
                        <Text className="text-[10px] font-bold uppercase tracking-[1.4px] text-muted">
                            {rule.name} · {new Date(game.endedAt ?? game.startedAt).toLocaleDateString("fr-FR")}
                        </Text>
                        <Text
                            numberOfLines={1}
                            className="text-[17px] font-bold text-ink dark:text-ink-dark"
                        >
                            {game.name}
                        </Text>
                    </View>
                </View>
                <View className="mt-4 flex-row items-baseline gap-2.5">
                    <Serif className="text-base text-muted">Gagnant</Serif>
                    <Text className="text-[22px] font-bold text-accent">{winner.name}</Text>
                    <Num className="text-sm font-semibold text-muted">{totals[winner.id]} pts</Num>
                </View>
            </View>

            <ScrollView contentContainerClassName="pb-safe-offset-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ width: ROW_L + game.players.length * COL_W }}>
                        <View className="flex-row border-b border-line py-2.5 dark:border-line-dark">
                            <Text
                                style={{ width: ROW_L }}
                                className="text-center text-[10px] font-bold tracking-[1px] text-muted"
                            >
                                T
                            </Text>
                            {game.players.map((p, i) => (
                                <Text
                                    key={p.id}
                                    numberOfLines={1}
                                    style={{ width: COL_W }}
                                    className={`text-center text-xs font-semibold ${cell} ${i === 0 ? "border-l border-line dark:border-line-dark" : ""} ${
                                        p.id === winner.id ? "text-accent" : "text-ink dark:text-ink-dark"
                                    }`}
                                >
                                    {p.name}
                                </Text>
                            ))}
                        </View>
                        {game.rounds.map((r, ri) => (
                            <View
                                key={r.id}
                                className="flex-row border-b border-line dark:border-line-dark"
                            >
                                <Serif
                                    style={{ width: ROW_L }}
                                    className="py-3 text-center text-[13px] text-muted"
                                >
                                    {ri + 1}
                                </Serif>
                                {game.players.map((p, i) => {
                                    const v = r.scores[p.id];
                                    return (
                                        <Num
                                            key={p.id}
                                            style={{ width: COL_W }}
                                            className={`py-3 text-center text-base font-medium text-ink dark:text-ink-dark ${cell} ${
                                                i === 0 ? "border-l border-line dark:border-line-dark" : ""
                                            }`}
                                        >
                                            {typeof v === "number" ? v : "·"}
                                        </Num>
                                    );
                                })}
                            </View>
                        ))}
                        <View className="flex-row bg-keymuted dark:bg-keymuted-dark">
                            <Serif
                                style={{ width: ROW_L }}
                                className="py-3.5 text-center text-sm text-muted"
                            >
                                Σ
                            </Serif>
                            {game.players.map((p, i) => (
                                <Num
                                    key={p.id}
                                    style={{ width: COL_W, letterSpacing: -0.6 }}
                                    className={`py-3.5 text-center text-[22px] font-bold ${cell} ${i === 0 ? "border-l border-line dark:border-line-dark" : ""} ${
                                        p.id === winner.id ? "text-accent" : "text-ink dark:text-ink-dark"
                                    }`}
                                >
                                    {totals[p.id]}
                                </Num>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View className="px-4 pt-5">
                    <PrimaryButton
                        onPress={onResume}
                        arrow={false}
                    >
                        Reprendre la partie
                    </PrimaryButton>
                </View>
            </ScrollView>
        </View>
    );
}
