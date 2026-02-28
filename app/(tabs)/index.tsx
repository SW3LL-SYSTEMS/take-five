import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSchedule } from "../../src/hooks/useSchedule";
import type { ScheduledReminder } from "../../src/types";

function formatTime(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h}:55 ${ampm}`;
}

export default function TodayScreen() {
  const { todayReminders, loading } = useSchedule();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (todayReminders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No reminders today</Text>
        <Text style={styles.emptySubtitle}>
          Configure your reminder window in Settings.
        </Text>
      </View>
    );
  }

  const now = Date.now();
  const nextIndex = todayReminders.findIndex((r) => r.timestamp > now);

  return (
    <FlatList
      data={todayReminders}
      keyExtractor={(item: ScheduledReminder) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => {
        const isPast = item.timestamp < now;
        const isNext = index === nextIndex;
        return (
          <View
            style={[
              styles.row,
              isPast && styles.pastRow,
              isNext && styles.nextRow,
            ]}
          >
            <Text style={[styles.timeText, isPast && styles.pastText]}>
              {formatTime(item.hour)}
            </Text>
            <Text
              style={[styles.exerciseText, isPast && styles.pastText]}
              numberOfLines={1}
            >
              {item.exercise}
            </Text>
            {isNext && <Text style={styles.nextBadge}>NEXT</Text>}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  list: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  pastRow: {
    opacity: 0.35,
  },
  nextRow: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    width: 85,
    color: "#111",
  },
  exerciseText: {
    fontSize: 16,
    flex: 1,
    color: "#111",
  },
  pastText: {
    color: "#666",
  },
  nextBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4CAF50",
    letterSpacing: 0.8,
  },
});
