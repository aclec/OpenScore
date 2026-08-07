// User-created rules ("Mes jeux"). The rows live in SQLite (src/db/customGames.ts);
// this module holds the in-memory registry `getRule` reads synchronously, plus the
// draft <-> rule conversion and validation used by the editor.

import { uid } from "@/lib/game";

import { ruleCapLabel } from "./labels";
import type { GameRule, ScoreDirection } from "./types";

/** Custom ids are prefixed so they never collide with a built-in game, and stay
 * URL-safe: they travel as a route segment to the editor. */
const PREFIX = "custom-";

/** Upper bound on a rule's player count — also the free counter's `maxPlayers`. */
export const MAX_PLAYERS = 20;

let customs: GameRule[] = [];

/** Replaces the registry. Called by the store on hydrate and after every write. */
export function setCustomRules(rules: GameRule[]): void {
    customs = rules;
}

export function findCustomRule(id: string): GameRule | undefined {
    return customs.find((r) => r.id === id);
}

/** Editor state: numbers stay strings so a field can be left empty (= no cap). */
export type RuleDraft = {
    name: string;
    description: string;
    scoreDirection: ScoreDirection;
    minPlayers: string;
    maxPlayers: string;
    maxRoundScore: string;
    maxGameScore: string;
    maxRounds: string;
    autoFillLast: boolean;
};

export function emptyDraft(): RuleDraft {
    return {
        name: "",
        description: "",
        scoreDirection: "asc",
        minPlayers: "2",
        maxPlayers: "6",
        maxRoundScore: "",
        maxGameScore: "",
        maxRounds: "",
        autoFillLast: false,
    };
}

export function draftFromRule(rule: GameRule): RuleDraft {
    return {
        name: rule.name,
        description: rule.description,
        scoreDirection: rule.scoreDirection,
        minPlayers: String(rule.minPlayers),
        maxPlayers: String(rule.maxPlayers),
        maxRoundScore: rule.maxRoundScore ? String(rule.maxRoundScore) : "",
        maxGameScore: rule.maxGameScore ? String(rule.maxGameScore) : "",
        maxRounds: rule.maxRounds ? String(rule.maxRounds) : "",
        autoFillLast: !!rule.autoFillLast,
    };
}

/** Positive integer, or null when the field is empty. NaN marks a bad value. */
function num(raw: string): number | null {
    const t = raw.trim();
    if (!t) return null;
    return Number(t);
}

const isBadCount = (v: number | null) => v !== null && (!Number.isInteger(v) || v <= 0);

/** First French error message, or null when the draft is valid. */
export function validateDraft(d: RuleDraft): string | null {
    if (!d.name.trim()) return "Donne un nom à ton jeu.";
    if (d.name.trim().length > 30) return "Le nom est trop long (30 caractères max).";

    const min = num(d.minPlayers);
    const max = num(d.maxPlayers);
    if (min === null || max === null) return "Indique le nombre de joueurs (min et max).";
    if (isBadCount(min) || isBadCount(max)) return "Le nombre de joueurs doit être un entier positif.";
    if (max > MAX_PLAYERS) return `${MAX_PLAYERS} joueurs au maximum.`;
    if (min > max) return "Le minimum de joueurs dépasse le maximum.";

    const caps = [num(d.maxRoundScore), num(d.maxGameScore), num(d.maxRounds)];
    if (caps.some(isBadCount)) return "Les limites doivent être des entiers positifs (ou vides).";
    return null;
}

/** Materialises a valid draft. `existing` keeps the id and creation date on edit. */
export function ruleFromDraft(d: RuleDraft, existing?: GameRule): GameRule {
    const name = d.name.trim();
    const maxRoundScore = num(d.maxRoundScore) ?? undefined;
    const maxGameScore = num(d.maxGameScore) ?? undefined;
    const maxRounds = num(d.maxRounds) ?? undefined;
    const rule: GameRule = {
        id: existing?.id ?? `${PREFIX}${uid()}`,
        name,
        maxRoundScore,
        maxGameScore,
        maxRounds,
        minPlayers: num(d.minPlayers)!,
        maxPlayers: num(d.maxPlayers)!,
        scoreDirection: d.scoreDirection,
        // The editor greys the option out without a round total; belt and braces here
        // because `autoFillLast` is meaningless (and unusable) without one.
        autoFillLast: d.autoFillLast && maxRoundScore !== undefined,
        // No editor control: the scoring engine does not enforce this flag yet
        // (the keyboard always offers the ± key), so free entry is the honest default.
        allowNegative: true,
        description: "",
        createdAt: existing?.createdAt ?? Date.now(),
    };
    rule.description = d.description.trim() || defaultDescription(rule);
    return rule;
}

/** Fallback blurb when the user leaves the description empty. */
function defaultDescription(rule: GameRule): string {
    const winner = rule.scoreDirection === "asc" ? "Le plus de points gagne." : "Le moins de points gagne.";
    const caps = ruleCapLabel(rule);
    return caps === "Libre" ? `Sans plafond. ${winner}` : `${caps}. ${winner}`;
}
