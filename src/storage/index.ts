import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppSettings, ExerciseState, StoredSchedule } from "../types";
import { ALL_EXERCISES, DEFAULT_SETTINGS } from "../constants/exercises";

const KEYS = {
  SETTINGS: "settings",
  EXERCISES: "exercises",
  SCHEDULE: "schedule",
} as const;

// --- Settings ---

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
  if (!raw) return { ...DEFAULT_SETTINGS };
  return JSON.parse(raw) as AppSettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// --- Exercises ---

export async function loadExercises(): Promise<ExerciseState> {
  const raw = await AsyncStorage.getItem(KEYS.EXERCISES);
  if (!raw) {
    const defaults: ExerciseState = {};
    for (const ex of ALL_EXERCISES) defaults[ex] = true;
    return defaults;
  }
  // Merge so new exercises added in app updates default to enabled
  const saved = JSON.parse(raw) as ExerciseState;
  const merged: ExerciseState = {};
  for (const ex of ALL_EXERCISES) {
    merged[ex] = saved[ex] !== undefined ? saved[ex] : true;
  }
  return merged;
}

export async function saveExercises(state: ExerciseState): Promise<void> {
  await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(state));
}

// --- Schedule ---

export async function loadStoredSchedule(): Promise<StoredSchedule | null> {
  const raw = await AsyncStorage.getItem(KEYS.SCHEDULE);
  if (!raw) return null;
  return JSON.parse(raw) as StoredSchedule;
}

export async function saveStoredSchedule(
  schedule: StoredSchedule
): Promise<void> {
  await AsyncStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
}
