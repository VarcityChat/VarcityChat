import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";
import { Platform } from "react-native";

export const usePushNotifications = () => {
  const { showToast } = useToast();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(
    undefined
  );

  async function registerPushNotificationsAsync() {
    let pushTokenString: string;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        showToast({
          type: "error",
          text1: "Permission not granted to get push token for notifications",
        });
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        showToast({ type: "error", text1: "Project ID not found" });
      }

      try {
        pushTokenString = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;
        return pushTokenString;
      } catch (e) {
        pushTokenString = "";
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
        return pushTokenString;
      }
    } else {
      alert("Must use a physical device for push notifications");
    }
  }

  const resetBadgeCount = async () => {
    await Notifications.setBadgeCountAsync(0);
  };

  useEffect(() => {
    registerPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token!);
      })
      .catch((error) => {
        throw Error(error);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, []);

  return { expoPushToken, notification, resetBadgeCount };
};
