import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import type {
  AppSettings,
  ExerciseState,
  ScheduledReminder,
  StoredSchedule,
} from "../types";
import { saveStoredSchedule } from "../storage";

// iOS hard cap is 64; we stay safely under it
const DAYS_AHEAD = 7;
const MAX_NOTIFICATIONS = 63;

function pickRandomExercise(exercises: ExerciseState): string {
  const enabled = Object.entries(exercises)
    .filter(([, isEnabled]) => isEnabled)
    .map(([name]) => name);
  if (enabled.length === 0) throw new Error("No exercises enabled");
  return enabled[Math.floor(Math.random() * enabled.length)];
}

function buildNotificationDates(
  settings: AppSettings,
  daysAhead: number
): Date[] {
  const dates: Date[] = [];
  const now = new Date();

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
    for (let hour = settings.startHour; hour <= settings.endHour; hour++) {
      const d = new Date(now);
      d.setDate(now.getDate() + dayOffset);
      d.setHours(hour, 55, 0, 0);

      // Skip times already in the past (with 5s buffer)
      if (d.getTime() > Date.now() + 5000) {
        dates.push(d);
      }
    }
  }

  return dates;
}

export async function rescheduleAllNotifications(
  settings: AppSettings,
  exercises: ExerciseState
): Promise<void> {
  // Cancel everything first
  await Notifications.cancelAllScheduledNotificationsAsync();

  const dates = buildNotificationDates(settings, DAYS_AHEAD).slice(
    0,
    MAX_NOTIFICATIONS
  );

  const reminders: ScheduledReminder[] = [];

  for (const date of dates) {
    const exercise = pickRandomExercise(exercises);
    const hour = date.getHours();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Take Five!",
        body: `Time to move: ${exercise}`,
        sound: true,
        data: { exercise, hour, date: date.toISOString() },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date,
      },
    });

    reminders.push({
      id,
      date: date.toISOString().split("T")[0],
      hour,
      minute: 55,
      exercise,
      timestamp: date.getTime(),
    });
  }

  const schedule: StoredSchedule = {
    generatedAt: Date.now(),
    reminders,
  };
  await saveStoredSchedule(schedule);
}
