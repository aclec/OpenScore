import { Redirect } from "expo-router";

import { ScoreBoard } from "@/components/scoreboard/ScoreBoard";
import { useActiveGame } from "@/store/useGame";

export default function GameScreen() {
    const active = useActiveGame();
    if (!active) return <Redirect href="/" />;
    return <ScoreBoard game={active} />;
}
