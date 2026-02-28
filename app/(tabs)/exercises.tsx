import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ALL_EXERCISES } from "../../src/constants/exercises";
import { useExercises } from "../../src/hooks/useExercises";

export default function ExercisesScreen() {
  const { exercises, loading, toggle } = useExercises();

  const enabledCount = Object.values(exercises).filter(Boolean).length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <FlatList
      data={ALL_EXERCISES}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text style={styles.header}>
          {enabledCount} of {ALL_EXERCISES.length} exercises enabled
        </Text>
      }
      renderItem={({ item }) => {
        const isEnabled = exercises[item] ?? true;
        const isLast = isEnabled && enabledCount <= 1;
        return (
          <View style={styles.row}>
            <Text style={[styles.exerciseName, !isEnabled && styles.dimmed]}>
              {item}
            </Text>
            <Switch
              value={isEnabled}
              onValueChange={(val) => toggle(item, val)}
              trackColor={{ false: "#ddd", true: "#4CAF50" }}
              disabled={isLast}
            />
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
  },
  list: {
    padding: 16,
  },
  header: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  exerciseName: {
    fontSize: 16,
    color: "#111",
    flex: 1,
    marginRight: 12,
  },
  dimmed: {
    color: "#aaa",
  },
});
