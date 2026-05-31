import { matchFont } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Platform, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import type { Game } from "@/lib/types";

import { buildSeries, playerColor } from "./chartData";
import { CumulativeLineChart } from "./CumulativeLineChart";
import { TotalsBarChart } from "./TotalsBarChart";

const FONT = matchFont({
    fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }) as string,
    fontSize: 11,
});

function SectionTitle({ children }: { children: string }) {
    return (
        <Text className="mb-1 mt-5 text-[11px] font-bold uppercase tracking-[1.2px] text-muted">{children}</Text>
    );
}

function Legend({ game }: { game: Game }) {
    return (
        <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-2">
            {game.players.map((p, i) => (
                <View
                    key={p.id}
                    className="flex-row items-center gap-1.5"
                >
                    <View
                        style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: playerColor(i) }}
                    />
                    <Text className="text-[13px] font-medium text-ink dark:text-ink-dark">{p.name}</Text>
                </View>
            ))}
        </View>
    );
}

export function ChartsModal({ visible, onClose, game }: { visible: boolean; onClose: () => void; game: Game }) {
    const series = useMemo(() => buildSeries(game), [game]);
    const hasData = series.cumulative.length > 0;
    const { width, height } = useWindowDimensions();
    const landscape = width > height;
    const chartH = landscape ? 210 : undefined;

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            header={<Text className="px-1 text-[17px] font-bold text-ink dark:text-ink-dark">Statistiques</Text>}
        >
            {hasData ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 8 }}
                >
                    <Legend game={game} />

                    {/* Landscape: the two charts sit side by side; portrait: stacked. */}
                    <View className={landscape ? "flex-row gap-4" : ""}>
                        <View className={landscape ? "flex-1" : ""}>
                            <SectionTitle>Total des points</SectionTitle>
                            <TotalsBarChart
                                players={game.players}
                                totals={series.totals}
                                font={FONT}
                                height={chartH}
                            />
                        </View>

                        <View className={landscape ? "flex-1" : ""}>
                            <SectionTitle>Évolution par manche</SectionTitle>
                            <CumulativeLineChart
                                cumulative={series.cumulative}
                                playerKeys={series.playerKeys}
                                font={FONT}
                                height={chartH}
                            />
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View className="items-center px-6 py-16">
                    <Text className="text-center text-[15px] text-muted">
                        Saisissez au moins une manche pour voir les graphiques.
                    </Text>
                </View>
            )}
        </BottomSheet>
    );
}
