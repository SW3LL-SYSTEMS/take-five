// IMPORTANT: background task must be imported before any components mount
// so TaskManager.defineTask() runs at module evaluation time.
import "../src/notifications/backgroundTask";

import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";

import { requestNotificationPermissions } from "../src/notifications/permissions";
import { rescheduleAllNotifications } from "../src/notifications/scheduler";
import { registerBackgroundTask } from "../src/notifications/backgroundTask";
import { loadSettings, loadExercises } from "../src/storage";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

// Show notifications even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();

    async function initialize() {
      const granted = await requestNotificationPermissions();
      if (!granted) return;

      const [settings, exercises] = await Promise.all([
        loadSettings(),
        loadExercises(),
      ]);
      await rescheduleAllNotifications(settings, exercises);
      await registerBackgroundTask();
    }

    initialize();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
