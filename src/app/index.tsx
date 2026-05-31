import { Redirect } from "expo-router";

import { NewGame } from "@/components/home/NewGame";
import { useActiveGame } from "@/store/useGame";

export default function HomeScreen() {
    // One game at a time: while a game is active the home is the game itself, so
    // launching the app resumes it and a new game can only start once the active
    // one is ended (or deleted) from the in-game menu.
    const active = useActiveGame();
    if (active) return <Redirect href="/game" />;
    return <NewGame />;
}
