/** SQL executed once on startup to ensure the schema exists. */
export const CREATE_TABLES = `
PRAGMA journal_mode = WAL;

-- Finished games. The full game document is stored as JSON in the data column;
-- ended_at is duplicated as a column so history can be ordered without parsing.
CREATE TABLE IF NOT EXISTS history (
  id TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL,
  ended_at INTEGER NOT NULL
);
`;
