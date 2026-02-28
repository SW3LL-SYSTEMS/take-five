import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { loadSettings, loadExercises } from "../storage";
import { rescheduleAllNotifications } from "./scheduler";

export const BACKGROUND_TASK_NAME = "RESCHEDULE_NOTIFICATIONS";

// Must be defined at module level (not inside a component or useEffect)
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const [settings, exercises] = await Promise.all([
      loadSettings(),
      loadExercises(),
    ]);
    await rescheduleAllNotifications(settings, exercises);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask(): Promise<void> {
  const status = await BackgroundFetch.getStatusAsync();
  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_TASK_NAME
  );
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 60 * 60 * 12, // 12 hours
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}
