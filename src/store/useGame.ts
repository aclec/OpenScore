// React bindings over the game store.

import { useMemo, useSyncExternalStore } from "react";

import { computeTotals } from "@/lib/game";
import type { Game, Totals } from "@/lib/types";

import { getSnapshot, subscribe, type AppState } from "./gameStore";

export function useAppState(): AppState {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useActiveGame(): Game | null {
    return useAppState().active;
}

export function useHistory(): Game[] {
    return useAppState().history;
}

/** Memoised running totals for a game. */
export function useTotals(game: Game | null): Totals {
    return useMemo(() => (game ? computeTotals(game) : {}), [game]);
}
