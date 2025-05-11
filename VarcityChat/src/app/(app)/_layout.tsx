import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { SocketProvider } from "@/context/SocketProvider";
import { useAuth } from "@/core/hooks/use-auth";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
export default function HomeLayout() {
  const { isAuthenticated, isLoading, isFirstLaunch } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

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
