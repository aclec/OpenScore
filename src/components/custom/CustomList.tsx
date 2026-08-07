import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { useCustomRules } from "@/store/useGame";
import { useColors } from "@/theme/colors";

import { IconButton } from "../ui/IconButton";
import { PrimaryButton } from "../ui/PrimaryButton";
import { Display } from "../ui/Txt";
import { Chevron } from "../ui/icons";
import { CustomCard } from "./CustomCard";

/** "Mes jeux": the user's own rules, each opening the editor. */
export function CustomList() {
    const router = useRouter();
    const c = useColors();
    const rules = useCustomRules();

    return (
        <View className="flex-1 bg-bg dark:bg-bg-dark">
            <View className="flex-row items-center gap-2.5 px-4 pb-1 pt-safe-offset-2">
                <IconButton
                    onPress={() => router.back()}
                    accessibilityLabel="Retour"
                >
                    <Chevron
                        dir="left"
                        color={c.ink}
                        size={13}
                    />
                </IconButton>
                <Text className="text-[10px] font-bold uppercase tracking-[1.4px] text-muted">Mes jeux</Text>
            </View>

            <View className="px-6 pt-3.5">
                <Text className="text-[34px] leading-[38px] tracking-[-1.2px]">
                    <Display className="text-ink dark:text-ink-dark">
                        {rules.length || "Aucun"} {rules.length > 1 ? "jeux" : "jeu"}
                    </Display>
                    {"\n"}
                    <Display className="text-muted">{rules.length > 1 ? "créés." : "créé."}</Display>
                </Text>
                <Text className="mt-3 text-[13px] leading-[18px] text-muted">
                    Tes propres règles : plafonds, sens du score, nombre de joueurs. Elles apparaissent ensuite dans le choix du jeu.
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-2.5 px-4 pb-8 pt-5"
                showsVerticalScrollIndicator={false}
            >
                {rules.length === 0 ? (
                    <Text className="mt-10 text-center text-sm text-muted">Aucun jeu personnalisé pour le moment.</Text>
                ) : (
                    rules.map((rule) => (
                        <CustomCard
                            key={rule.id}
                            rule={rule}
                            onOpen={() => router.push(`/custom/${rule.id}`)}
                        />
                    ))
                )}
            </ScrollView>

            <View className="border-t border-line bg-bg px-4 pb-safe-offset-4 pt-3 dark:border-line-dark dark:bg-bg-dark">
                <PrimaryButton
                    onPress={() => router.push("/custom/new")}
                    arrow={false}
                >
                    Créer un jeu
                </PrimaryButton>
            </View>
        </View>
    );
}
