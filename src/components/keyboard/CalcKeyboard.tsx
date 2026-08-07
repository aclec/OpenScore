import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { safeEval } from "@/lib/calc";
import type { Player } from "@/lib/types";
import { TABULAR } from "@/theme/colors";

import { Num } from "../ui/Txt";
import { CalcKey } from "./CalcKey";
import { PlayerChip } from "./PlayerChip";

export type CalcKeyboardProps = {
    open: boolean;
    initial: number | null | undefined;
    playerName?: string;
    suggested: number | null;
    isLastInRound: boolean;
    players: Player[];
    roundScores: Record<string, number | null>;
    currentPlayerId?: string;
    /** "sheet" = bottom modal (portrait); "side" = docked half-screen column (landscape). */
    variant?: "sheet" | "side";
    onValidate: (v: number | null) => void;
    onNext: (v: number | null) => void;
    onCancel: () => void;
    onSwitchPlayer: (targetId: string, value: number | null) => void;
};

/** Spoken labels for operator/digit symbols a screen reader can't read aloud. */
const OP_LABELS: Record<string, string> = { "×": "Multiplier", "−": "Soustraire", "+": "Additionner" };

function chunkPairs<T>(arr: T[]): T[][] {
    const rows: T[][] = [];
    for (let i = 0; i < arr.length; i += 2) rows.push(arr.slice(i, i + 2));
    return rows;
}

/**
 * Modal wrapper. The stateful body is remounted (via `key`) whenever the keyboard
 * opens or switches player, so `expr` re-initialises from `initial` without an effect.
 */
export function CalcKeyboard(props: CalcKeyboardProps) {
    // Docked column (landscape): rendered inline so the grid stays visible beside it.
    if (props.variant === "side") {
        return props.open ? (
            <KeyboardBody
                key={props.currentPlayerId ?? "none"}
                {...props}
            />
        ) : null;
    }
    return (
        <Modal
            visible={props.open}
            transparent
            animationType="fade"
            onRequestClose={props.onCancel}
            statusBarTranslucent
        >
            {props.open && (
                <KeyboardBody
                    key={props.currentPlayerId ?? "none"}
                    {...props}
                />
            )}
        </Modal>
    );
}

function KeyboardBody(props: CalcKeyboardProps) {
    const { initial, playerName, suggested, isLastInRound, players, roundScores, currentPlayerId } = props;
    const [expr, setExpr] = useState(() => (initial != null ? String(initial) : ""));

    const result = safeEval(expr);
    const isComputed = !!expr && /[+\-*/×÷()]/.test(expr) && result !== null;

    const push = (s: string) => setExpr((e) => e + s);
    const commit = () => {
        const v = safeEval(expr);
        if (v === null && expr !== "") return;
        props.onValidate(v);
    };
    const commitNext = () => {
        const v = safeEval(expr);
        if (v === null && expr !== "") return;
        props.onNext(v);
    };
    const switchTo = (id: string) => {
        if (id === currentPlayerId) return;
        props.onSwitchPlayer(id, expr ? safeEval(expr) : null);
    };
    const toggleParen = () => push(expr.split("(").length > expr.split(")").length ? ")" : "(");
    const toggleSign = () => setExpr((e) => (e.startsWith("-") ? e.slice(1) : "-" + e));

    const side = props.variant === "side";
    const rowCls = `flex-row gap-1.5 ${side ? "flex-1" : ""}`;

    const display = (
        <View className="px-2.5 pb-3.5">
            <View className="mb-1.5 flex-row items-center justify-between">
                <Text className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                    Score · <Text className="text-ink dark:text-ink-dark">{playerName}</Text>
                </Text>
                {suggested != null && (
                    <Pressable
                        onPress={() => setExpr(String(suggested))}
                        accessibilityRole="button"
                        accessibilityLabel={`Remplir automatiquement : ${suggested}`}
                        className="flex-row items-center gap-1 rounded-lg bg-accent-soft px-2.5 py-1 active:opacity-70 dark:bg-accent-soft-dark"
                    >
                        <Num className="text-[11px] font-bold text-accent">Auto · {suggested}</Num>
                    </Pressable>
                )}
            </View>
            <View className="min-h-[46px] flex-row items-baseline justify-between gap-3">
                <Text
                    numberOfLines={1}
                    className={`flex-1 ${isComputed ? "text-muted" : "text-ink dark:text-ink-dark"}`}
                    style={[TABULAR, { fontSize: isComputed ? 22 : 40, fontWeight: "500", letterSpacing: -1.2 }]}
                >
                    {expr || "0"}
                </Text>
                {isComputed && (
                    <Num
                        className="text-accent"
                        style={{ fontSize: 40, fontWeight: "700", letterSpacing: -1.2 }}
                    >
                        = {result}
                    </Num>
                )}
            </View>
        </View>
    );

    const keys = (
        <View className={`gap-1.5 ${side ? "flex-1" : ""}`}>
            <View className={rowCls}>
                <CalcKey label="C" a11yLabel="Tout effacer" variant="op" fill={side} onPress={() => setExpr("")} fontSize={16} fontWeight="700" />
                <CalcKey label="( )" a11yLabel="Parenthèse" variant="op" fill={side} onPress={toggleParen} fontSize={18} />
                <CalcKey label="±" a11yLabel="Changer de signe" variant="op" fill={side} onPress={toggleSign} fontSize={20} />
                <CalcKey label="÷" a11yLabel="Diviser" variant="op" fill={side} onPress={() => push("÷")} fontSize={22} fontWeight="600" />
            </View>
            {[
                ["7", "8", "9", "×"],
                ["4", "5", "6", "−"],
                ["1", "2", "3", "+"],
            ].map((r, i) => (
                <View
                    key={i}
                    className={rowCls}
                >
                    {r.map((k) => {
                        const op = "×−+".includes(k);
                        return (
                            <CalcKey
                                key={k}
                                label={k}
                                a11yLabel={OP_LABELS[k]}
                                variant={op ? "op" : "default"}
                                fill={side}
                                onPress={() => push(k === "−" ? "-" : k)}
                                fontSize={op ? 22 : 24}
                                fontWeight={op ? "600" : "500"}
                            />
                        );
                    })}
                </View>
            ))}
            <View className={rowCls}>
                <CalcKey label="0" wide fill={side} onPress={() => push("0")} />
                <CalcKey label="," a11yLabel="Virgule" fill={side} onPress={() => push(".")} fontSize={26} fontWeight="700" />
                <CalcKey
                    label={<Text className=" text-[22px] text-ink dark:text-ink-dark">⌫</Text>}
                    a11yLabel="Supprimer le dernier chiffre"
                    variant="op"
                    fill={side}
                    onPress={() => setExpr((e) => e.slice(0, -1))}
                />
            </View>
            <View className={`flex-row gap-1.5 ${side ? "flex-1" : "mt-0.5"}`}>
                <CalcKey label="OK" variant="primary" fill={side} onPress={commit} fontSize={16} fontWeight="700" />
                <CalcKey
                    label={isLastInRound ? "Terminer" : "Suivant →"}
                    variant="primary"
                    wide
                    fill={side}
                    onPress={commitNext}
                    fontSize={16}
                    fontWeight="700"
                />
            </View>
        </View>
    );

    if (side) {
        return (
            <View className="flex-1 border-l border-line bg-elevated px-2.5 pb-safe-offset-2 pt-3 dark:border-line-dark dark:bg-elevated-dark">
                {display}
                {keys}
            </View>
        );
    }

    return (
        <Pressable
            className="flex-1 justify-end bg-night/35"
            onPress={props.onCancel}
        >
            {players.length > 1 && (
                <Pressable
                    className="flex-1 justify-end gap-2 px-3 pb-2.5 pt-3.5"
                    onPress={props.onCancel}
                >
                    {chunkPairs(players).map((row, ri) => (
                        <View
                            key={ri}
                            className="flex-row gap-2"
                        >
                            {row.map((p) => (
                                <View
                                    key={p.id}
                                    className="flex-1"
                                >
                                    <PlayerChip
                                        player={p}
                                        isCurrent={p.id === currentPlayerId}
                                        value={roundScores[p.id]}
                                        draft={p.id === currentPlayerId ? (isComputed ? "= " + result : expr) : null}
                                        onPress={() => switchTo(p.id)}
                                    />
                                </View>
                            ))}
                            {row.length === 1 && <View className="flex-1" />}
                        </View>
                    ))}
                </Pressable>
            )}

            <Pressable
                onPress={() => {}}
                className="rounded-t-[22px] bg-elevated px-2.5 pb-safe-offset-4 pt-2.5 dark:bg-elevated-dark"
            >
                <View className="mx-auto mb-2.5 mt-1 h-1 w-9 rounded-full bg-line-strong dark:bg-line-strong-dark" />
                {display}
                {keys}
            </Pressable>
        </Pressable>
    );
}
