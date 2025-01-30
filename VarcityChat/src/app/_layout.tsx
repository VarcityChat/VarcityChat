import { ReactNode, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  SplashScreen,
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useThemeConfig } from "@/core/use-theme-config";
import { ThemeProvider } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_200ExtraLight_Italic,
  PlusJakartaSans_300Light,
  PlusJakartaSans_300Light_Italic,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_400Regular_Italic,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_700Bold_Italic,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_800ExtraBold_Italic,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";

export { ErrorBoundary } from "expo-router";

import "../../global.css";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    PlusJakartaSans_200ExtraLight_Italic,
    PlusJakartaSans_300Light_Italic,
    PlusJakartaSans_400Regular_Italic,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_600SemiBold_Italic,
    PlusJakartaSans_700Bold_Italic,
    PlusJakartaSans_800ExtraBold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();

  // const hideSplash = async () => {
  //   await SplashScreen.hideAsync();
  // };

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     hideSplash();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) return null;

  const authenticated = false;

  useEffect(() => {
    if (authenticated) {
      router.replace("/(app)");
    } else {
      router.replace("/onboarding-one");
    }
  }, [authenticated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="home" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen
          name="forgot-password-otp"
          options={{ headerShown: false }}
        /> */}
    </Stack>
  );
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? "dark" : undefined}
    >
      <ThemeProvider value={theme}>
        <MenuProvider>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </MenuProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
