// Typed game-rule system. One file per game under src/games/, registered in index.ts.

export type ScoreDirection = "asc" | "desc";

export type GameRule = {
    id: string;
    name: string;
    /** Cap on the *sum of one round* (manche). Drives `autoFillLast`. Optional. */
    maxRoundScore?: number;
    /** Target/cap on a player's *running total* that ends the game (partie). Optional. */
    maxGameScore?: number;
    /** Max number of rounds (manches) before the game ends. Optional. */
    maxRounds?: number;
    minPlayers: number;
    maxPlayers: number;
    /** 'asc' = highest total wins, 'desc' = lowest total wins. */
    scoreDirection: ScoreDirection;
    autoFillLast?: boolean;
    allowNegative?: boolean;
    description: string;
};
