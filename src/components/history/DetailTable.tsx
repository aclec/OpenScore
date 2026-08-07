import { ScrollView, Text, View } from "react-native";

import type { Game } from "@/lib/types";

import { Num } from "../ui/Txt";

const COL_W = 68;
const ROW_L = 38;

type Props = { game: Game; totals: Record<string, number>; winnerId: string };

/** Read-only round-by-round grid of a finished game (scrolls horizontally). */
export function DetailTable({ game, totals, winnerId }: Props) {
    const cell = "border-r border-line dark:border-line-dark";
    const firstCol = (i: number) => (i === 0 ? "border-l border-line dark:border-line-dark" : "");

    return (
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
                            className={`text-center text-xs font-semibold ${cell} ${firstCol(i)} ${
                                p.id === winnerId ? "text-accent" : "text-ink dark:text-ink-dark"
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
                        <Num
                            style={{ width: ROW_L }}
                            className="py-3 text-center text-[13px] font-semibold text-muted"
                        >
                            {ri + 1}
                        </Num>
                        {game.players.map((p, i) => {
                            const v = r.scores[p.id];
                            return (
                                <Num
                                    key={p.id}
                                    style={{ width: COL_W }}
                                    className={`py-3 text-center text-base font-semibold text-ink dark:text-ink-dark ${cell} ${firstCol(i)}`}
                                >
                                    {typeof v === "number" ? v : "·"}
                                </Num>
                            );
                        })}
                    </View>
                ))}
                <View className="flex-row bg-keymuted dark:bg-keymuted-dark">
                    <Text
                        style={{ width: ROW_L }}
                        className="py-3.5 text-center text-sm font-bold text-muted"
                    >
                        Σ
                    </Text>
                    {game.players.map((p, i) => (
                        <Num
                            key={p.id}
                            style={{ width: COL_W, letterSpacing: -0.6 }}
                            className={`py-3.5 text-center text-[22px] font-bold ${cell} ${firstCol(i)} ${
                                p.id === winnerId ? "text-accent" : "text-ink dark:text-ink-dark"
                            }`}
                        >
                            {totals[p.id]}
                        </Num>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
