import { Stack } from "expo-router";

export default function DiscoverScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
    </Stack>
  );
}
