import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { loadExercises, saveExercises, loadSettings } from "../storage";
import { rescheduleAllNotifications } from "../notifications/scheduler";
import type { ExerciseState } from "../types";

export function useExercises() {
  const [exercises, setExercises] = useState<ExerciseState>({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadExercises().then((state) => {
        setExercises(state);
        setLoading(false);
      });
    }, [])
  );

  const toggle = useCallback(
    async (name: string, value: boolean) => {
      if (!value) {
        const enabledCount = Object.values(exercises).filter(Boolean).length;
        if (enabledCount <= 1) return;
      }

      const updated = { ...exercises, [name]: value };
      setExercises(updated);
      await saveExercises(updated);

      const settings = await loadSettings();
      await rescheduleAllNotifications(settings, updated);
    },
    [exercises]
  );

  return { exercises, loading, toggle };
}
