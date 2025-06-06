import { useUpdateDeviceTokenMutation } from "@/api/auth/auth-api";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { SocketProvider } from "@/context/SocketProvider";
import { useAuth } from "@/core/hooks/use-auth";
import { usePushNotifications } from "@/core/hooks/use-push-notification";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
export default function HomeLayout() {
  const { isAuthenticated, isLoading, isFirstLaunch } = useAuth();
  const { expoPushToken, resetBadgeCount } = usePushNotifications();
  const [updateDeviceToken] = useUpdateDeviceTokenMutation();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (expoPushToken && isAuthenticated && !isLoading) {
      const handleNotifications = () => {
        try {
          resetBadgeCount();
          updateDeviceToken({ deviceToken: expoPushToken });
        } catch (e) {}
      };
      handleNotifications();
    }
  }, [expoPushToken, isLoading, isAuthenticated]);

  if (isLoading) return null;

  if (!isAuthenticated) {
    if (!isFirstLaunch) {
      return <Redirect href="/login" />;
    }
    return <Redirect href="/onboarding/onboarding-one" />;
  }

  return (
    <SocketProvider>
      <AudioPlayerProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AudioPlayerProvider>
    </SocketProvider>
  );
}
