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

/** Games older than this are purged whenever a new one is finished. */
const HISTORY_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** Inserts (or replaces) a finished game, then purges games older than a month. */
export function addHistory(game: Game): void {
    const endedAt = game.endedAt ?? Date.now();
    db.runSync(
        "INSERT OR REPLACE INTO history (id, data, ended_at) VALUES (?, ?, ?)",
        game.id,
        JSON.stringify(game),
        endedAt
    );
    db.runSync("DELETE FROM history WHERE ended_at < ?", endedAt - HISTORY_MAX_AGE_MS);
}

export function deleteHistory(id: string): void {
    db.runSync("DELETE FROM history WHERE id = ?", id);
}
