import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { getRule } from "@/games";
import type { Game } from "@/lib/types";
import { deleteActive, endActive, renameActive, setScore } from "@/store/gameStore";
import { useTotals } from "@/store/useGame";

import { CalcKeyboard } from "../keyboard/CalcKeyboard";
import { GameHeader } from "./Header";
import { ScoreGrid, type Editing } from "./ScoreGrid";
import { GameMenu, RenameSheet } from "./Sheets";

const LABEL_W = 38;
const ROW_H = 50;
const MIN_COL_W = 52;

export function ScoreBoard({ game }: { game: Game }) {
    const router = useRouter();
    const rule = getRule(game.gameRuleId);
    const totals = useTotals(game);

    const [editing, setEditing] = useState<Editing>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [nameDraft, setNameDraft] = useState(game.name);
    const [containerW, setContainerW] = useState(390);

    const goHome = () => router.navigate("/");

    // Column width: fill the screen when few players, otherwise size to the
    // longest name (min 52px tap target) and let the grid scroll horizontally.
    const colW = useMemo(() => {
        const longest = game.players.reduce((a, p) => (p.name.length > a ? p.name.length : a), 0);
        const minColW = Math.max(longest * 8 + 18, MIN_COL_W);
        const equalFit = (containerW - LABEL_W) / game.players.length;
        return Math.max(minColW, equalFit);
    }, [game.players, containerW]);

    const lastRound = game.rounds[game.rounds.length - 1];
    const lastFilled = !lastRound || game.players.every((p) => typeof lastRound.scores[p.id] === "number");
    // Stop offering a new round once the round cap (maxRounds) is reached.
    const roundCapReached = rule.maxRounds != null && game.rounds.length >= rule.maxRounds;
    const displayRounds = lastFilled && !roundCapReached ? [...game.rounds, { id: "__draft__", scores: {} }] : game.rounds;

    // Progress toward whichever end condition applies. A game cap (partie) ends when
    // *someone* reaches it, so we track the highest running total regardless of who is
    // winning (works for both directions). Otherwise fall back to round-count progress.
    // Null when neither cap is set.
    const leadTotal = Math.max(...Object.values(totals), 0);
    const progress = rule.maxGameScore
        ? leadTotal / rule.maxGameScore
        : rule.maxRounds
          ? game.rounds.length / rule.maxRounds
          : null;

    // Move to the next player without a score on this row; close when the row is full.
    const goNext = (justSetId: string | null) => {
        if (!editing) return;
        const round = game.rounds[editing.roundIndex] ?? { scores: {} };
        const filled = new Set(game.players.filter((p) => typeof round.scores[p.id] === "number").map((p) => p.id));
        if (justSetId) filled.add(justSetId);
        const idx = game.players.findIndex((p) => p.id === editing.playerId);
        const n = game.players.length;
        for (let i = 1; i <= n; i++) {
            const next = game.players[(idx + i) % n];
            if (!filled.has(next.id)) {
                setEditing({ roundIndex: editing.roundIndex, playerId: next.id });
                return;
            }
        }
        setEditing(null);
    };

    const editingPlayer = editing ? game.players.find((p) => p.id === editing.playerId) : undefined;
    const editingValue = editing ? game.rounds[editing.roundIndex]?.scores[editing.playerId] : undefined;
    const roundScores = useMemo<Record<string, number | null>>(
        () => (editing ? (game.rounds[editing.roundIndex]?.scores ?? {}) : {}),
        [editing, game.rounds]
    );

    const isLastInRound =
        !!editing && game.players.filter((p) => p.id !== editing.playerId).every((p) => typeof roundScores[p.id] === "number");

    // Papayo-style auto-fill: last remaining player completes the round to maxRoundScore.
    const suggestedFill = useMemo<number | null>(() => {
        if (!editing || !rule.autoFillLast || !rule.maxRoundScore) return null;
        const others = game.players.filter((p) => p.id !== editing.playerId);
        if (!others.every((p) => typeof roundScores[p.id] === "number")) return null;
        const sum = others.reduce((acc, p) => acc + (roundScores[p.id] ?? 0), 0);
        return rule.maxRoundScore - sum;
    }, [editing, rule, game.players, roundScores]);

    const onLayout = (e: LayoutChangeEvent) => setContainerW(e.nativeEvent.layout.width);

    return (
        <View
            className="flex-1 bg-bg dark:bg-bg-dark"
            onLayout={onLayout}
        >
            <GameHeader
                game={game}
                rule={rule}
                progress={progress}
                onMenu={() => setMenuOpen(true)}
            />

            <ScoreGrid
                game={game}
                rounds={displayRounds}
                totals={totals}
                colW={colW}
                labelW={LABEL_W}
                rowH={ROW_H}
                editing={editing}
                onEditCell={(roundIndex, playerId) => setEditing({ roundIndex, playerId })}
            />

            <CalcKeyboard
                open={!!editing}
                playerName={editingPlayer?.name}
                initial={editingValue}
                suggested={suggestedFill}
                isLastInRound={isLastInRound}
                players={editing ? game.players : []}
                roundScores={roundScores}
                currentPlayerId={editing?.playerId}
                onValidate={(v) => {
                    if (editing && v !== null) setScore(editing.roundIndex, editing.playerId, v);
                    setEditing(null);
                }}
                onNext={(v) => {
                    const wasSet = !!editing && v !== null;
                    if (editing && wasSet) setScore(editing.roundIndex, editing.playerId, v);
                    goNext(wasSet ? editing!.playerId : null);
                }}
                onSwitchPlayer={(targetId, value) => {
                    if (!editing) return;
                    if (value !== null) setScore(editing.roundIndex, editing.playerId, value);
                    setEditing({ roundIndex: editing.roundIndex, playerId: targetId });
                }}
                onCancel={() => setEditing(null)}
            />

            <GameMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onRename={() => {
                    setMenuOpen(false);
                    setNameDraft(game.name);
                    setRenaming(true);
                }}
                onEnd={() => {
                    setMenuOpen(false);
                    endActive();
                    goHome();
                }}
                onDelete={() => {
                    setMenuOpen(false);
                    deleteActive();
                    goHome();
                }}
            />

            <RenameSheet
                visible={renaming}
                value={nameDraft}
                onChange={setNameDraft}
                onCancel={() => {
                    setNameDraft(game.name);
                    setRenaming(false);
                }}
                onSave={() => {
                    renameActive(nameDraft.trim() || game.name);
                    setRenaming(false);
                }}
            />
        </View>
    );
}
