import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* <Stack.Screen name="" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="register" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="forgot-password" /> */}
      {/* <Stack.Screen name="reset-password" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="forgot-password-otp" /> */}
    </Stack>
  );
}
