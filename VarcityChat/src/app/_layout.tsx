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
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store, useAppDispatch } from "@/core/store/store";
import { useAuth } from "@/core/hooks/use-auth";
import { authStorage } from "@/core/storage";
import { setAuth } from "@/core/auth/auth-slice";
import Toast from "react-native-toast-message";

export { ErrorBoundary } from "expo-router";

import "../../global.css";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  const dispatch = useAppDispatch();
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
    const handleInitialize = async () => {
      const authData = await authStorage.getAuthData();
      if (authData) {
        dispatch(setAuth({ ...authData, isAuthenticated: true }));
      } else {
        dispatch(setAuth({ token: "", isAuthenticated: false }));
      }

      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    };

    handleInitialize();
  }, [fontsLoaded]);

  return (
    <Providers>
      <RootLayoutNav />
      <Toast />
    </Providers>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/discover");
    } else {
      router.replace("/onboarding/onboarding-one");
    }
  }, [isAuthenticated]);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
