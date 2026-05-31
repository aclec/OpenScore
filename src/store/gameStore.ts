// Reactive app store: the active game (MMKV) + finished history (SQLite).
// Plain external store consumed via useSyncExternalStore — no Context, no Redux.

import * as history from "@/db/history";
import { cloneGame, uid } from "@/lib/game";
import type { Game } from "@/lib/types";

import { loadActiveGame, persistActiveGame } from "./active";

export type AppState = { active: Game | null; history: Game[] };

let state: AppState = { active: null, history: [] };
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Replaces state immutably and persists `active` to MMKV. */
function set(next: Partial<AppState>, persistActive = true): void {
    state = { ...state, ...next };
    if (persistActive) persistActiveGame(state.active);
    emit();
}

/** Loads persisted data into memory. Call once after the DB is initialised. */
export function hydrate(): void {
    if (hydrated) return;
    state = { active: loadActiveGame(), history: history.listHistory() };
    hydrated = true;
    emit();
}

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getSnapshot(): AppState {
    return state;
}

// ── Actions ────────────────────────────────────────────────────────────────

export function startGame(game: Game): void {
    set({ active: game });
}

export function setScore(roundIndex: number, playerId: string, value: number | null): void {
    if (!state.active) return;
    const g = cloneGame(state.active);
    while (g.rounds.length <= roundIndex) g.rounds.push({ id: uid(), scores: {} });
    g.rounds[roundIndex].scores[playerId] = value;
    set({ active: g });
}

export function renameActive(name: string): void {
    if (!state.active) return;
    set({ active: { ...state.active, name } });
}

export function endActive(): void {
    if (!state.active) return;
    const ended: Game = { ...state.active, endedAt: Date.now() };
    history.addHistory(ended);
    set({ active: null, history: [ended, ...state.history] });
}

export function deleteActive(): void {
    set({ active: null });
}

export function deleteHistory(id: string): void {
    history.deleteHistory(id);
    set({ history: state.history.filter((g) => g.id !== id) }, false);
}

/**
 * Reopens a finished game from history as the active game, keeping its rounds
 * and id so play continues where it stopped. It leaves history (no longer
 * finished) and returns there if ended again. Safe to call only when no game is
 * active — guaranteed by routing, since history is unreachable while one is.
 */
export function resume(id: string): Game | null {
    const src = state.history.find((g) => g.id === id);
    if (!src) return null;
    const reopened: Game = { ...cloneGame(src), endedAt: null };
    history.deleteHistory(id);
    set({ active: reopened, history: state.history.filter((g) => g.id !== id) });
    return reopened;
}
