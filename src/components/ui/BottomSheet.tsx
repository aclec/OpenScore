import { useEffect } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const SPRING = { damping: 22, stiffness: 240, mass: 0.7 };

type Props = {
    visible: boolean;
    onClose: () => void;
    /** Draggable header area (grabber is added above it). */
    header?: React.ReactNode;
    children: React.ReactNode;
};

/**
 * Bottom sheet you can drag: pull down past a threshold (or fling) to dismiss,
 * release short to spring back. Backdrop stays a dim translucent black.
 */
export function BottomSheet({ visible, onClose, header, children }: Props) {
    const { height } = useWindowDimensions();
    const ty = useSharedValue(height);
    const start = useSharedValue(0);

    useEffect(() => {
        if (visible) ty.value = withSpring(0, SPRING);
    }, [visible, ty]);

    const dismiss = () => {
        ty.value = withTiming(height, { duration: 220 }, (done) => {
            if (done) scheduleOnRN(onClose);
        });
    };

    const pan = Gesture.Pan()
        .onStart(() => {
            start.value = ty.value;
        })
        .onUpdate((e) => {
            const next = start.value + e.translationY;
            // Rubber-band the upward (negative) overscroll so it can be raised but resists.
            ty.value = next < 0 ? next * 0.25 : next;
        })
        .onEnd((e) => {
            if (ty.value > 110 || e.velocityY > 800) {
                ty.value = withTiming(height, { duration: 220 }, (done) => {
                    if (done) scheduleOnRN(onClose);
                });
            } else {
                ty.value = withSpring(0, SPRING);
            }
        });

    const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={dismiss}
            statusBarTranslucent
            // iOS Modals default to portrait-only — without this the sheet would
            // snap the screen back to portrait when opened in landscape.
            supportedOrientations={["portrait", "landscape"]}
        >
            <GestureHandlerRootView style={styles.flex}>
                <View className="flex-1 justify-end">
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        className="bg-night/40"
                        onPress={dismiss}
                    />
                    <Animated.View
                        style={sheetStyle}
                        className="max-h-[88%] rounded-t-[20px] bg-surface px-safe-offset-4 pb-safe-offset-4 pt-2 dark:bg-surface-dark"
                    >
                        <GestureDetector gesture={pan}>
                            <View className="pb-1">
                                <View className="mx-auto mb-2 mt-1 h-1 w-9 rounded-full bg-line-strong dark:bg-line-strong-dark" />
                                {header}
                            </View>
                        </GestureDetector>
                        {children}
                    </Animated.View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
