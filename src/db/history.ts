// Finished-game history, persisted in SQLite (one row per game, document as JSON).

import type { Game } from "@/lib/types";

import { db } from "./client";

type Row = { data: string };

/** Finished games, most recently ended first. */
export function listHistory(): Game[] {
    const rows = db.getAllSync<Row>("SELECT data FROM history ORDER BY ended_at DESC");
    return rows.map((r) => JSON.parse(r.data) as Game);
}

/** Single finished game by id, or null. */
export function getHistoryGame(id: string): Game | null {
    const row = db.getFirstSync<Row>("SELECT data FROM history WHERE id = ?", id);
    return row ? (JSON.parse(row.data) as Game) : null;
}

/** Inserts (or replaces) a finished game. Requires `endedAt` to be set. */
export function addHistory(game: Game): void {
    db.runSync(
        "INSERT OR REPLACE INTO history (id, data, ended_at) VALUES (?, ?, ?)",
        game.id,
        JSON.stringify(game),
        game.endedAt ?? Date.now()
    );
}

export function deleteHistory(id: string): void {
    db.runSync("DELETE FROM history WHERE id = ?", id);
}
