import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

const GREEN = "#4CAF50";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GREEN,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarLabel: "Today",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Exercises",
          tabBarLabel: "Exercises",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "figure.strengthtraining.traditional", android: "fitness_center", web: "fitness_center" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "gearshape", android: "settings", web: "settings" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
