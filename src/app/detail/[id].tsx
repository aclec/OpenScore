import { Redirect, useLocalSearchParams } from "expo-router";

import { Detail } from "@/components/history/Detail";

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (!id) return <Redirect href="/history" />;
    return <Detail gameId={id} />;
}
