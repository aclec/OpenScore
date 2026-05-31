import { Pressable, Text, TextInput, View } from "react-native";

import { useColors } from "@/theme/colors";

import { Serif } from "../ui/Txt";

/** Uppercase section label with optional trailing control. */
export function Field({ label, trailing, children }: { label: string; trailing?: React.ReactNode; children: React.ReactNode }) {
    return (
        <View>
            <View className="mb-2.5 flex-row items-center justify-between">
                <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted">{label}</Text>
                {trailing}
            </View>
            {children}
        </View>
    );
}

export function PlayerRow({
    index,
    value,
    onChange,
    onRemove,
    last,
}: {
    index: number;
    value: string;
    onChange: (v: string) => void;
    onRemove?: () => void;
    last: boolean;
}) {
    const c = useColors();
    return (
        <View className={`flex-row items-center gap-3 py-2.5 ${last ? "" : "border-b border-line dark:border-line-dark"}`}>
            <Serif className="w-[22px] text-[18px] text-muted">{index + 1}.</Serif>
            <TextInputRow
                value={value}
                onChange={onChange}
                placeholder={`Joueur ${index + 1}`}
                color={c.ink}
                muted={c.muted}
            />
            {onRemove && (
                <Pressable
                    onPress={onRemove}
                    accessibilityRole="button"
                    accessibilityLabel={`Retirer le joueur ${index + 1}`}
                    hitSlop={8}
                    className="h-7 w-7 items-center justify-center rounded-full bg-keymuted active:opacity-70 dark:bg-keymuted-dark"
                >
                    <Text className="text-base leading-none text-muted">×</Text>
                </Pressable>
            )}
        </View>
    );
}

/** Full-width dashed button that appends a new (empty) player row. */
export function AddPlayerButton({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Ajouter un joueur"
            accessibilityState={{ disabled }}
            className={`mt-3 flex-row items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-3 dark:border-line-dark ${disabled ? "opacity-40" : "active:opacity-70"}`}
        >
            <Text className="text-lg leading-none text-accent">+</Text>
            <Text className="text-sm font-semibold text-ink dark:text-ink-dark">Ajouter un joueur</Text>
        </Pressable>
    );
}

// Small wrapper so the player input keeps a single styled definition.
function TextInputRow({
    value,
    onChange,
    placeholder,
    color,
    muted,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    color: string;
    muted: string;
}) {
    return (
        <TextInput
            value={value}
            onChangeText={onChange}
            accessibilityLabel={placeholder}
            placeholder={placeholder}
            placeholderTextColor={muted}
            style={{ flex: 1, fontSize: 17, fontWeight: "500", color, padding: 0 }}
        />
    );
}

