import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  if (Platform.OS === "ios") {
    const { ios } = await Notifications.getPermissionsAsync();
    return (
      ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
      ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  }

  return status === "granted";
}

export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}
