import { View, Text } from "@/ui";
import { Stack } from "expo-router";

export default function ProfileScreenLayout() {
  return (
    <View className="flex flex-1">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
