import "react-native-get-random-values";
import Realm from "realm";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
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
import { RealmProvider, useRealm } from "@realm/react";
import { persistor, store, useAppDispatch } from "@/core/store/store";
import { loadSelectedTheme } from "@/core/hooks/use-selected-theme";
import { useAuth } from "@/core/hooks/use-auth";
import { authStorage } from "@/core/storage";
import { setAuth } from "@/core/auth/auth-slice";
import { MessageSchema } from "@/core/models/message-model";
import Toast from "react-native-toast-message";
import * as Updates from "expo-updates";

export { ErrorBoundary } from "expo-router";

import "../../global.css";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isUpdateChecked, setIsUpdateChecked] = useState(true);
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
    } catch (e) {
    } finally {
      setIsUpdateChecked(true);
    }
  };

  // useEffect(() => {
  //   checkForOTAUpdate();
  // }, []);

  useEffect(() => {
    if (fontsLoaded && isUpdateChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isUpdateChecked]);

  if (!fontsLoaded) return null;

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
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await authStorage.getAuthData();
        if (authData) {
          dispatch(setAuth({ ...authData, isAuthenticated: true }));
        } else {
          dispatch(setAuth({ token: "", isAuthenticated: false }));
        }
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
    loadSelectedTheme();
  }, []);

  useEffect(() => {
    const inProtectedGroup = segments[0] === "(app)";
    if (isAuthChecked) {
      if (isAuthenticated && !inProtectedGroup) {
        router.replace("/discover");
      } else if (!isAuthenticated) {
        router.canDismiss() && router.dismissAll();
        router.replace("/onboarding/onboarding-one");
      }
    }
  }, [isAuthenticated, isAuthChecked]);

  if (!isAuthChecked) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();

  const migration = (oldRealm: Realm, newRealm: Realm) => {
    if (oldRealm.schemaVersion < 1) {
      const oldObjects = oldRealm.objects("Message");
      const newObjects = newRealm.objects("Message");
    }
  };

  return (
    <RealmProvider
      schema={[MessageSchema]}
      schemaVersion={13}
      onMigration={migration}
    >
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
