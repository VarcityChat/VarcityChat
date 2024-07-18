import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat-message" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile-detail" />
    </Stack>
  );
}
