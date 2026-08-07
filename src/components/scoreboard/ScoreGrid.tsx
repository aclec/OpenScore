import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { Game, Round, Totals } from "@/lib/types";

import { Num } from "../ui/Txt";

export type Editing = { roundIndex: number; playerId: string } | null;

type Props = {
    game: Game;
    rounds: Round[];
    totals: Totals;
    colW: number;
    labelW: number;
    rowH: number;
    editing: Editing;
    onEditCell: (roundIndex: number, playerId: string) => void;
};

export function ScoreGrid({ game, rounds, totals, colW, labelW, rowH, editing, onEditCell }: Props) {
    const totalW = labelW + game.players.length * colW;
    const cellBorder = "border-r border-line dark:border-line-dark";

    // Fill the empty space below the rounds with grid rows so the columns reach
    // the totals — but only enough to fill the screen, never enough to force a
    // scroll when the rounds don't already overflow. The last filler shrinks to
    // land exactly on the bottom edge (no gap, no overflow).
    const [areaH, setAreaH] = useState(0);
    const leftover = areaH - rounds.length * rowH;
    const fillerCount = leftover > 0 ? Math.ceil(leftover / rowH) : 0;
    const lastFillerH = leftover - (fillerCount - 1) * rowH;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ height: "100%" }}
        >
            <View style={{ width: totalW, height: "100%" }}>
                {/* Header row — player names. Fixed at top, scrolls with columns. */}
                <View
                    className="flex-row border-b border-line-strong bg-bg dark:border-line-strong-dark dark:bg-bg-dark"
                    style={{ height: 48 }}
                >
                    <View
                        style={{ width: labelW }}
                        className="items-center justify-center"
                    >
                        <Text className="text-[11px] font-bold uppercase tracking-[1px] text-muted">n</Text>
                    </View>
                    {game.players.map((p, i) => (
                        <View
                            key={p.id}
                            style={{ width: colW }}
                            className={`items-center justify-center px-1 ${cellBorder} ${i === 0 ? "border-l border-line dark:border-line-dark" : ""}`}
                        >
                            <Text
                                numberOfLines={1}
                                className="text-[13px] font-semibold text-ink dark:text-ink-dark"
                            >
                                {p.name}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Rounds (scroll vertically) + fillers to extend the columns. */}
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    onLayout={(e) => setAreaH(e.nativeEvent.layout.height)}
                >
                    {rounds.map((round, ri) => {
                        const isDraft = round.id === "__draft__";
                        const showNumber = !isDraft || ri === game.rounds.length;
                        return (
                            <View
                                key={round.id + ri}
                                style={{ minHeight: rowH }}
                                className={`flex-row border-b border-line dark:border-line-dark ${isDraft ? "bg-draft dark:bg-draft-dark" : ""}`}
                            >
                                <View
                                    style={{ width: labelW }}
                                    className="items-center justify-center"
                                >
                                    {showNumber && <Num className="text-[15px] font-semibold text-muted">{ri + 1}</Num>}
                                </View>
                                {game.players.map((p, pi) => {
                                    const v = round.scores[p.id];
                                    const filled = typeof v === "number";
                                    const active = editing?.roundIndex === ri && editing?.playerId === p.id;
                                    return (
                                        <Pressable
                                            key={p.id}
                                            onPress={() => onEditCell(ri, p.id)}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Score ${p.name} tour ${ri + 1}`}
                                            style={{ width: colW }}
                                            className={`items-center justify-center ${cellBorder} ${
                                                pi === 0 ? "border-l border-line dark:border-line-dark" : ""
                                            } ${active ? "bg-accent-soft dark:bg-accent-soft-dark" : ""}`}
                                        >
                                            <Text
                                                maxFontSizeMultiplier={1.4}
                                                style={{
                                                    fontSize: 19,
                                                    fontWeight: filled ? "600" : "400",
                                                    letterSpacing: -0.4,
                                                    fontVariant: ["tabular-nums"],
                                                }}
                                                className={
                                                    filled
                                                        ? "text-ink dark:text-ink-dark"
                                                        : active
                                                          ? "text-accent"
                                                          : "text-faint dark:text-faint-dark"
                                                }
                                            >
                                                {filled ? v : active ? "·" : ""}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        );
                    })}
                    {Array.from({ length: fillerCount }).map((_, fi) => (
                        <View
                            key={`f${fi}`}
                            style={{ height: fi === fillerCount - 1 ? lastFillerH : rowH }}
                            className="flex-row border-b border-line dark:border-line-dark"
                        >
                            <View style={{ width: labelW }} />
                            {game.players.map((p, pi) => (
                                <View
                                    key={p.id}
                                    style={{ width: colW }}
                                    className={`${cellBorder} ${pi === 0 ? "border-l border-line dark:border-line-dark" : ""}`}
                                />
                            ))}
                        </View>
                    ))}
                </ScrollView>

                {/* Totals — fixed at bottom, scrolls with columns. pb-safe on the row
                    lifts it above the home indicator while the cells stay centered. */}
                <View className="flex-row border-t border-line-strong bg-elevated pb-safe dark:border-line-strong-dark dark:bg-elevated-dark">
                    <View
                        style={{ width: labelW }}
                        className="items-center justify-center py-3.5"
                    >
                        <Text className="text-base font-bold text-muted">Σ</Text>
                    </View>
                    {game.players.map((p, i) => (
                        <View
                            key={p.id}
                            style={{ width: colW }}
                            className={`items-center justify-center py-3 ${cellBorder} ${i === 0 ? "border-l border-line dark:border-line-dark" : ""}`}
                        >
                            <Num
                                className="text-2xl font-bold text-ink dark:text-ink-dark"
                                style={{ letterSpacing: -0.8 }}
                            >
                                {totals[p.id] || 0}
                            </Num>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
