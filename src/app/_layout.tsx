import "../../global.css";

import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SafeAreaBridge } from "@/components/SafeAreaBridge";
import { initDatabase } from "@/db/client";
import { hydrate } from "@/store/gameStore";

export default function RootLayout() {
    useEffect(() => {
        initDatabase();
        hydrate();
        // App-wide default: portrait. The scoreboard screen unlocks rotation itself.
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, []);

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaBridge>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="game" />
                    <Stack.Screen name="history" />
                    <Stack.Screen name="detail/[id]" />
                    <Stack.Screen name="custom/index" />
                    <Stack.Screen name="custom/[id]" />
                </Stack>
            </SafeAreaBridge>
        </GestureHandlerRootView>
    );
}
