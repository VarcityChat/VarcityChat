import "react-native-get-random-values";
import { ReactNode, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SplashScreen, Stack } from "expo-router";
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
import { RealmProvider } from "@realm/react";
import { persistor, store, useAppDispatch } from "@/core/store/store";
import { loadSelectedTheme } from "@/core/hooks/use-selected-theme";
import { useAuth } from "@/core/hooks/use-auth";
import { authStorage, setItem } from "@/core/storage";
import { setAuth, setIsLoading } from "@/core/auth/auth-slice";
import { MessageSchema, ReplySchema } from "@/core/models/message-model";
import { IsFirstLaunchKey } from "@/types/user";
import Toast from "react-native-toast-message";
import * as Updates from "expo-updates";

export { ErrorBoundary } from "expo-router";

import "../../global.css";

export const unstable_settings = {
  initialRouteName: "/",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  const checkForOTAUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {}
  };

  useEffect(() => {
    checkForOTAUpdate();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Providers>
      <RootLayoutNav />
      <Toast />
    </Providers>
  );
}

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const { isFirstLaunch } = useAuth();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if this is the users first launch
        if (isFirstLaunch) {
          await setItem(IsFirstLaunchKey, "notFirstLaunch");
        }

        // Check if user was authenticated and rehydrate state
        const authData = await authStorage.getAuthData();
        if (authData) {
          dispatch(setAuth({ ...authData, isAuthenticated: true }));
        }
      } catch (e) {
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    loadSelectedTheme();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{ gestureEnabled: false, animation: "none" }}
      />
    </Stack>
  );
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();

  return (
    <RealmProvider schema={[MessageSchema, ReplySchema]} schemaVersion={14}>
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
    </RealmProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
