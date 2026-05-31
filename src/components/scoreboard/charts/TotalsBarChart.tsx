import { Group, RoundedRect, Text as SkiaText, type SkFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart } from "victory-native";

import type { Player } from "@/lib/types";
import { useColors } from "@/theme/colors";

import { playerColor, type Series } from "./chartData";

type Props = { players: Player[]; totals: Series["totals"]; font: SkFont | null; height?: number };

/** Vertical bars of each player's running total, one color per player. */
export function TotalsBarChart({ players, totals, font, height = 240 }: Props) {
    const c = useColors();
    return (
        <View style={{ height }}>
            <CartesianChart
                data={totals}
                xKey="x"
                yKeys={["total"]}
                domainPadding={{ left: 44, right: 44, top: 28, bottom: 8 }}
                axisOptions={{
                    font,
                    labelColor: c.muted,
                    lineColor: c.line,
                    formatXLabel: (v) => players[v]?.name ?? "",
                    formatYLabel: (v) => String(Math.round(v)),
                }}
            >
                {({ points, chartBounds, yScale }) => {
                    const zero = yScale(0);
                    const n = points.total.length;
                    const slot = (chartBounds.right - chartBounds.left) / Math.max(n, 1);
                    const barW = Math.min(slot * 0.5, 46);
                    return points.total.map((pt, i) => {
                        if (pt.y == null) return null;
                        const top = Math.min(pt.y, zero);
                        const h = Math.max(Math.abs(pt.y - zero), 1);
                        const value = totals[i].total;
                        const labelW = font?.measureText(String(value)).width ?? 0;
                        return (
                            <Group key={players[i]?.id ?? i}>
                                <RoundedRect
                                    x={pt.x - barW / 2}
                                    y={top}
                                    width={barW}
                                    height={h}
                                    r={6}
                                    color={playerColor(i)}
                                />
                                {font && (
                                    <SkiaText
                                        x={pt.x - labelW / 2}
                                        y={(value >= 0 ? top : top + h) + (value >= 0 ? -8 : 16)}
                                        text={String(value)}
                                        font={font}
                                        color={c.ink}
                                    />
                                )}
                            </Group>
                        );
                    });
                }}
            </CartesianChart>
        </View>
    );
}
