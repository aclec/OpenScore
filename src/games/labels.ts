// Human-readable summaries of a rule. Kept out of index.ts so `custom.ts` can use
// them without importing the registry (which imports custom.ts back).

import type { GameRule } from "./types";

/**
 * Short label for a rule's score caps, e.g. "250/manche", "500/partie",
 * "250/manche · 500/partie", or "Libre" when neither cap is set. All caps are
 * optional, so every combination is handled.
 */
export function ruleCapLabel(rule: GameRule): string {
    const parts: string[] = [];
    if (rule.maxRoundScore) parts.push(`${rule.maxRoundScore}/manche`);
    if (rule.maxGameScore) parts.push(`${rule.maxGameScore}/partie`);
    if (rule.maxRounds) parts.push(`${rule.maxRounds} manches`);
    return parts.length ? parts.join(" · ") : "Libre";
}

/** "2–8" or "4" — the rule's player range. */
export function rulePlayerRange(rule: GameRule): string {
    return rule.maxPlayers !== rule.minPlayers ? `${rule.minPlayers}–${rule.maxPlayers}` : `${rule.minPlayers}`;
}

/** "250/manche · 3–6 j." style summary line for a rule. */
export function ruleMeta(rule: GameRule): string {
    return `${ruleCapLabel(rule)} · ${rulePlayerRange(rule)} j.`;
}
