import { useLocalSearchParams } from "expo-router";

import { CustomEditor } from "@/components/custom/CustomEditor";

/** `/custom/new` creates a rule, `/custom/<id>` edits an existing one. */
export default function CustomEditorScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <CustomEditor ruleId={id === "new" ? undefined : id} />;
}
