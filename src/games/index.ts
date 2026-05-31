// Game registry. `DEFAULT_RULE` is the free counter (the baseline mode, not a real
// game). Each real game lives in its own file and is listed in `GAMES` — add a new
// `./<game>.ts` and push it here to expose it in the picker.

import { papayo } from "./papayo";
import type { GameRule } from "./types";

export type { GameRule, ScoreDirection } from "./types";

/** Free counter — the baseline mode, no plafond, no constraint. Not a real game. */
export const DEFAULT_RULE: GameRule = {
    id: "defaut",
    name: "Défaut",
    scoreDirection: "asc",
    allowNegative: true,
    minPlayers: 2,
    maxPlayers: 20,
    description: "Comptage libre, sans plafond ni contrainte.",
};

/** Real games — one entry per file in this folder. */
export const GAMES: GameRule[] = [papayo];

const RULES_BY_ID: Record<string, GameRule> = Object.fromEntries([DEFAULT_RULE, ...GAMES].map((r) => [r.id, r]));

/** Rule lookup with a safe fallback to the free counter. */
export function getRule(id: string): GameRule {
    return RULES_BY_ID[id] ?? DEFAULT_RULE;
}

/** True when `id` refers to the free counter rather than a real game. */
export const isDefault = (id: string) => id === DEFAULT_RULE.id;

/**
 * Short label for a rule's score caps, e.g. "250/manche", "500/partie",
 * "250/manche · 500/partie", or "Libre" when neither cap is set. Both caps are
 * always optional, so all four combinations are handled.
 */
export function ruleCapLabel(rule: GameRule): string {
    const parts: string[] = [];
    if (rule.maxRoundScore) parts.push(`${rule.maxRoundScore}/manche`);
    if (rule.maxGameScore) parts.push(`${rule.maxGameScore}/partie`);
    if (rule.maxRounds) parts.push(`${rule.maxRounds} manches`);
    return parts.length ? parts.join(" · ") : "Libre";
}
