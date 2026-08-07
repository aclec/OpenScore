// User-created game rules, persisted in SQLite (one row per rule, document as JSON).

import type { GameRule } from "@/games";

import { db } from "./client";

type Row = { data: string };

/** Custom rules, oldest first (creation order is the list order). */
export function listCustomGames(): GameRule[] {
    const rows = db.getAllSync<Row>("SELECT data FROM custom_games ORDER BY created_at ASC");
    return rows.map((r) => JSON.parse(r.data) as GameRule);
}

/** Inserts a new rule or replaces an edited one. */
export function upsertCustomGame(rule: GameRule): void {
    db.runSync(
        "INSERT OR REPLACE INTO custom_games (id, data, created_at) VALUES (?, ?, ?)",
        rule.id,
        JSON.stringify(rule),
        rule.createdAt ?? Date.now()
    );
}

export function deleteCustomGame(id: string): void {
    db.runSync("DELETE FROM custom_games WHERE id = ?", id);
}
