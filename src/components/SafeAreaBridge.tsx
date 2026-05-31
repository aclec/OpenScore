import type { ReactNode } from "react";
import {
    initialWindowMetrics,
    SafeAreaListener,
} from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

// uniwind's free tier doesn't auto-inject native safe-area insets: its runtime
// keeps insets at 0 until `Uniwind.updateInsets` is called, so `pt-safe`,
// `px-safe`, … all resolve to 0. SafeAreaListener is itself a native provider,
// so this also satisfies `useSafeAreaInsets` consumers — no extra SafeAreaProvider.

// Seed insets synchronously so the first paint isn't off by the inset amount.
if (initialWindowMetrics) {
    Uniwind.updateInsets(initialWindowMetrics.insets);
}

export function SafeAreaBridge({ children }: { children: ReactNode }) {
    return (
        <SafeAreaListener
            style={{ flex: 1 }}
            onChange={({ insets }) => Uniwind.updateInsets(insets)}
        >
            {children}
        </SafeAreaListener>
    );
}
