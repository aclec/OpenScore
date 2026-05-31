import { Redirect, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback } from "react";

import { ScoreBoard } from "@/components/scoreboard/ScoreBoard";
import { useActiveGame } from "@/store/useGame";

export default function GameScreen() {
    const active = useActiveGame();

    // The scoreboard is the one screen that may rotate: free orientation while
    // focused, back to portrait on leave.
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.unlockAsync();
            return () => {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            };
        }, [])
    );

    if (!active) return <Redirect href="/" />;
    return <ScoreBoard game={active} />;
}
