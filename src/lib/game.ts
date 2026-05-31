// Pure helpers for building and deriving game state.

import type { Game, Totals } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10);

export function todayLabel(): string {
    return `Partie du ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
}

export function createGame({ name, gameRuleId, players }: { name?: string; gameRuleId: string; players: string[] }): Game {
    return {
        id: uid(),
        name: name?.trim() || todayLabel(),
        gameRuleId,
        players: players.map((p, i) => ({ id: uid(), name: p.trim() || `Joueur ${i + 1}` })),
        rounds: [],
        startedAt: Date.now(),
        endedAt: null,
    };
}

/** Sum of numeric scores per player. */
export function computeTotals(game: Game): Totals {
    const totals: Totals = {};
    for (const p of game.players) totals[p.id] = 0;
    for (const r of game.rounds) {
        for (const p of game.players) {
            const v = r.scores[p.id];
            if (typeof v === "number") totals[p.id] += v;
        }
    }
    return totals;
}

/** Deep-clones a game so reducers can mutate `rounds`/`scores` safely. */
export function cloneGame(game: Game): Game {
    return {
        ...game,
        players: game.players.map((p) => ({ ...p })),
        rounds: game.rounds.map((r) => ({ ...r, scores: { ...r.scores } })),
    };
}
