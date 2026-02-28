import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { loadStoredSchedule } from "../storage";
import type { ScheduledReminder } from "../types";

export function useSchedule() {
  const [todayReminders, setTodayReminders] = useState<ScheduledReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadToday = useCallback(async () => {
    setLoading(true);
    const stored = await loadStoredSchedule();
    if (!stored) {
      setTodayReminders([]);
      setLoading(false);
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const today = stored.reminders
      .filter((r) => r.date === todayStr)
      .sort((a, b) => a.timestamp - b.timestamp);

    setTodayReminders(today);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  return { todayReminders, loading, reload: loadToday };
}
