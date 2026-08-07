// Game registry. `DEFAULT_RULE` is the free counter (the baseline mode, not a real
// game). Each real game lives in its own file and is listed in `GAMES` — add a new
// `./<game>.ts` and push it here to expose it in the picker. User-created rules are
// resolved on top of these, see ./custom.ts.

import { findCustomRule, MAX_PLAYERS } from "./custom";
import { papayo } from "./papayo";
import type { GameRule } from "./types";

export type { GameRule, ScoreDirection } from "./types";
export { ruleCapLabel, ruleMeta } from "./labels";
export { draftFromRule, emptyDraft, ruleFromDraft, setCustomRules, validateDraft, type RuleDraft } from "./custom";

/** Free counter — the baseline mode, no plafond, no constraint. Not a real game. */
export const DEFAULT_RULE: GameRule = {
    id: "defaut",
    name: "Défaut",
    scoreDirection: "asc",
    allowNegative: true,
    minPlayers: 2,
    maxPlayers: MAX_PLAYERS,
    description: "Comptage libre, sans plafond ni contrainte.",
};

/** Real games — one entry per file in this folder. */
export const GAMES: GameRule[] = [papayo];

const RULES_BY_ID: Record<string, GameRule> = Object.fromEntries([DEFAULT_RULE, ...GAMES].map((r) => [r.id, r]));

/**
 * Rule lookup with a safe fallback to the free counter. Custom rules come from the
 * in-memory registry, so a game whose custom rule was deleted falls back gracefully.
 */
export function getRule(id: string): GameRule {
    return RULES_BY_ID[id] ?? findCustomRule(id) ?? DEFAULT_RULE;
}

/** True when `id` refers to the free counter rather than a real game. */
export const isDefault = (id: string) => id === DEFAULT_RULE.id;
