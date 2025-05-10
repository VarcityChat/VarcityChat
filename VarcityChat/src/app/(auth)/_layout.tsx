import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "onboarding",
};
export default function AuthLayout() {
  console.log("REACHING AUTH LAYOUT");
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="forgot-password-otp" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
