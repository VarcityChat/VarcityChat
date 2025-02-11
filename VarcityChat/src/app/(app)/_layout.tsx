import { SocketProvider } from "@/context/SocketContext";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <SocketProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat-message" />
        <Stack.Screen name="university" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile-detail" />
        <Stack.Screen name="users" />
      </Stack>
    </SocketProvider>
  );
}
