// The single in-progress game, persisted synchronously in MMKV.

import type { Game } from "@/lib/types";

import { storage } from "./mmkv";

const KEY = "active-game";

export function loadActiveGame(): Game | null {
    const raw = storage.getString(KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Game;
    } catch {
        return null;
    }
}

export function persistActiveGame(game: Game | null): void {
    if (game) storage.set(KEY, JSON.stringify(game));
    else storage.remove(KEY);
}
