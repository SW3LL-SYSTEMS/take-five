export interface ScheduledReminder {
  id: string;
  date: string; // "YYYY-MM-DD"
  hour: number;
  minute: 55;
  exercise: string;
  timestamp: number; // Unix ms
}

export interface AppSettings {
  startHour: number; // default 9
  endHour: number; // default 21
}

export interface StoredSchedule {
  generatedAt: number;
  reminders: ScheduledReminder[];
}

export interface ExerciseState {
  [exerciseName: string]: boolean;
}
