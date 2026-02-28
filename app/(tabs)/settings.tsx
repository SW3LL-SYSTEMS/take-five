import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSettings } from "../../src/hooks/useSettings";

// 6 AM (6) through 10 PM (22)
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

export default function SettingsScreen() {
  const { settings, loading, saving, save } = useSettings();
  const [draftStart, setDraftStart] = useState(settings.startHour);
  const [draftEnd, setDraftEnd] = useState(settings.endHour);

  useEffect(() => {
    setDraftStart(settings.startHour);
    setDraftEnd(settings.endHour);
  }, [settings.startHour, settings.endHour]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const isValid = draftStart < draftEnd;
  const count = draftEnd - draftStart + 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Daily Reminder Window</Text>
      <Text style={styles.subtitle}>
        You'll get a reminder at :55 past each hour in this window.
      </Text>

      <View style={styles.pickerRow}>
        <View style={styles.pickerCard}>
          <Text style={styles.pickerLabel}>From</Text>
          <Picker
            selectedValue={draftStart}
            onValueChange={(val) => setDraftStart(val as number)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {HOURS.map((h) => (
              <Picker.Item key={h} label={formatHour(h)} value={h} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerCard}>
          <Text style={styles.pickerLabel}>To</Text>
          <Picker
            selectedValue={draftEnd}
            onValueChange={(val) => setDraftEnd(val as number)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {HOURS.map((h) => (
              <Picker.Item key={h} label={formatHour(h)} value={h} />
            ))}
          </Picker>
        </View>
      </View>

      {!isValid && (
        <Text style={styles.errorText}>End time must be after start time.</Text>
      )}

      {isValid && (
        <Text style={styles.previewText}>
          {count} reminder{count !== 1 ? "s" : ""} per day — first at{" "}
          {formatHour(draftStart)}:55, last at {formatHour(draftEnd)}:55
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!isValid || saving) && styles.saveButtonDisabled,
        ]}
        onPress={() => save({ startHour: draftStart, endHour: draftEnd })}
        disabled={!isValid || saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save & Reschedule</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        {Platform.OS === "ios"
          ? "iOS schedules up to 7 days of reminders at a time. Open the app periodically to keep them refreshed."
          : "Reminders are scheduled up to 7 days ahead and refreshed each time you open the app."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  pickerRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  pickerCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    overflow: "hidden",
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  picker: {
    height: 150,
  },
  pickerItem: {
    fontSize: 16,
  },
  errorText: {
    color: "#e53935",
    fontSize: 14,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 12,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  note: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 24,
    textAlign: "center",
    lineHeight: 18,
  },
});
