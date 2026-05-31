import type { GameRule } from "./types";

export const papayo: GameRule = {
    id: "papayo",
    name: "Papayo",
    maxRoundScore: 250,
    minPlayers: 2,
    maxPlayers: 8,
    scoreDirection: "desc",
    autoFillLast: true,
    allowNegative: false,
    description: "250 pts par manche. Le moins de points gagne.",
};
