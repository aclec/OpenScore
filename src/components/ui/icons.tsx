// Lightweight icons drawn from Views — no SVG / icon-font dependency.

import { View } from "react-native";

type IconProps = { color: string; size?: number };

const ROTATION: Record<string, string> = {
    right: "45deg",
    left: "-135deg",
    up: "-45deg",
    down: "135deg",
};

/** A chevron built from two borders of a rotated square. */
export function Chevron({
    dir = "right",
    color,
    size = 12,
    weight = 2,
}: IconProps & { dir?: "left" | "right" | "up" | "down"; weight?: number }) {
    const box = size * 0.72;
    return (
        <View
            style={{
                width: box,
                height: box,
                borderTopWidth: weight,
                borderRightWidth: weight,
                borderColor: color,
                transform: [{ rotate: ROTATION[dir] }],
            }}
        />
    );
}

/** A checkmark drawn from the bottom + right borders of a rotated box. */
export function Check({ color, size = 14, weight = 2 }: IconProps & { weight?: number }) {
    return (
        <View
            style={{
                width: size * 0.5,
                height: size,
                borderRightWidth: weight,
                borderBottomWidth: weight,
                borderColor: color,
                transform: [{ rotate: "45deg" }],
            }}
        />
    );
}

/** Horizontal three-dot menu glyph. */
export function Dots({ color, size = 3 }: IconProps) {
    const dot = { width: size, height: size, borderRadius: size / 2, backgroundColor: color };
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: size * 1.6 }}>
            <View style={dot} />
            <View style={dot} />
            <View style={dot} />
        </View>
    );
}

/** Mini bar-chart glyph: three vertical bars of increasing height. */
export function Chart({ color, size = 14 }: IconProps) {
    const bar = (h: number) => ({
        width: size * 0.2,
        height: h,
        borderRadius: 1.5,
        backgroundColor: color,
    });
    return (
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: size * 0.12, height: size }}>
            <View style={bar(size * 0.5)} />
            <View style={bar(size)} />
            <View style={bar(size * 0.72)} />
        </View>
    );
}

/** Magnifier: a ring plus a short handle. */
export function Search({ color, size = 14 }: IconProps) {
    const ring = size * 0.66;
    return (
        <View style={{ width: size, height: size }}>
            <View
                style={{
                    width: ring,
                    height: ring,
                    borderRadius: ring / 2,
                    borderWidth: 1.5,
                    borderColor: color,
                }}
            />
            <View
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: size * 0.34,
                    height: 1.5,
                    backgroundColor: color,
                    borderRadius: 1,
                    transform: [{ rotate: "45deg" }],
                }}
            />
        </View>
    );
}
