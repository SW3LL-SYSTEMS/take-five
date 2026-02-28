import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { loadSettings, saveSettings, loadExercises } from "../storage";
import { rescheduleAllNotifications } from "../notifications/scheduler";
import type { AppSettings } from "../types";
import { DEFAULT_SETTINGS } from "../constants/exercises";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSettings().then((s) => {
        setSettings(s);
        setLoading(false);
      });
    }, [])
  );

  const save = useCallback(async (newSettings: AppSettings) => {
    if (newSettings.startHour >= newSettings.endHour) return;
    setSaving(true);
    await saveSettings(newSettings);
    setSettings(newSettings);
    const exercises = await loadExercises();
    await rescheduleAllNotifications(newSettings, exercises);
    setSaving(false);
  }, []);

  return { settings, loading, saving, save };
}
