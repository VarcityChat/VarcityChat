import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { SocketProvider } from "@/context/SocketProvider";
import { useAuth } from "@/core/hooks/use-auth";
import { Redirect, Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function HomeLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/onboarding/onboarding-one" />;
  }

  return (
    <SocketProvider>
      <AudioPlayerProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat-message" />
          <Stack.Screen name="university" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="profile-detail" />
          <Stack.Screen name="users" />
        </Stack>
      </AudioPlayerProvider>
    </SocketProvider>
  );
}
