import * as SQLite from "expo-sqlite";

import { CREATE_TABLES } from "./schema";

/** Shared synchronous SQLite connection. */
export const db = SQLite.openDatabaseSync("openscore.db");

let initialized = false;

/** Creates tables on first call. Safe to invoke multiple times. */
export function initDatabase(): void {
    if (initialized) return;
    db.execSync(CREATE_TABLES);
    initialized = true;
}
