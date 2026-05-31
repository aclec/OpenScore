import { createMMKV, type MMKV } from "react-native-mmkv";

/**
 * App-wide synchronous key/value store backed by MMKV.
 * Holds the in-progress game (`active.ts`) and small preferences.
 * Finished-game history lives in SQLite (`@/db/history`).
 */
export const storage: MMKV = createMMKV({ id: "openscore" });
