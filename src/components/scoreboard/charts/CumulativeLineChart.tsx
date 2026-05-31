import { type SkFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";

import { useColors } from "@/theme/colors";

import { playerColor, type Series } from "./chartData";

type Props = { cumulative: Series["cumulative"]; playerKeys: string[]; font: SkFont | null; height?: number };

/** One line per player tracing their cumulative total round by round. */
export function CumulativeLineChart({ cumulative, playerKeys, font, height = 260 }: Props) {
    const c = useColors();
    return (
        <View style={{ height }}>
            <CartesianChart
                data={cumulative}
                xKey="round"
                yKeys={playerKeys}
                domainPadding={{ left: 12, right: 16, top: 24, bottom: 8 }}
                axisOptions={{
                    font,
                    labelColor: c.muted,
                    lineColor: c.line,
                    formatXLabel: (v) => String(Math.round(v)),
                    formatYLabel: (v) => String(Math.round(v)),
                    tickCount: { x: Math.min(cumulative.length, 8), y: 5 },
                }}
            >
                {({ points }) => (
                    <>
                        {playerKeys.map((key, i) => (
                            <Line
                                key={key}
                                points={points[key]}
                                color={playerColor(i)}
                                strokeWidth={2.5}
                                curveType="linear"
                                animate={{ type: "timing", duration: 250 }}
                            />
                        ))}
                    </>
                )}
            </CartesianChart>
        </View>
    );
}
