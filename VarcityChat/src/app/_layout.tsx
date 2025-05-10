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
import { RealmProvider } from "@realm/react";
import { persistor, store, useAppDispatch } from "@/core/store/store";
import { loadSelectedTheme } from "@/core/hooks/use-selected-theme";
import { useAuth } from "@/core/hooks/use-auth";
import { authStorage } from "@/core/storage";
import { logout, setAuth } from "@/core/auth/auth-slice";
// import { usePushNotifications } from "@/core/hooks/use-push-notification";
// import { useUpdateDeviceTokenMutation } from "@/api/auth/auth-api";
import { MessageSchema } from "@/core/models/message-model";
import Toast from "react-native-toast-message";
// import * as Updates from "expo-updates";

export { ErrorBoundary } from "expo-router";

import "../../global.css";

export const unstable_settings = {
  initialRouteName: "(app)",
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

  // const checkForOTAUpdate = async () => {
  //   try {
  //     const update = await Updates.checkForUpdateAsync();
  //     if (update.isAvailable) {
  //       await Updates.fetchUpdateAsync();
  //       await Updates.reloadAsync();
  //     }
  //   } catch (e) {
  //     alert(`Update check failed: ${e}`);
  //   } finally {
  //     setIsUpdateChecked(true);
  //   }
  // };

  // useEffect(() => {
  //   checkForOTAUpdate();
  // }, []);

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Providers>
      {/* <Stack>
        <Stack.Screen name="index" redirect />
        <Stack.Screen
          name="(app)"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, animation: "none" }}
        />
      </Stack> */}
      <RootLayoutNav />
      <Toast />
    </Providers>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  // const segments = useSegments();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);
  // const { expoPushToken, resetBadgeCount } = usePushNotifications();
  // const [updateDeviceToken] = useUpdateDeviceTokenMutation();

  // console.log("\nIS AUTHENTICATED:", isAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // dispatch(logout());
        const authData = await authStorage.getAuthData();
        if (authData) {
          dispatch(setAuth({ ...authData, isAuthenticated: true }));
        }
      } catch (e) {
        console.log("ERROR FETCHING AUTH FROM STORAGE:", e);
      } finally {
        setIsReady(true);
      }
    };

    console.log("[CHECKING AUTH]");
    checkAuth();
    // loadSelectedTheme();
  }, []);

  useEffect(() => {
    console.log("[ IS AUTHENTICATED VALUE ]:", isAuthenticated);
  }, [isAuthenticated]);

  // useEffect(() => {
  //   // const inProtectedGroup = segments[0] === "(app)";
  //   // if (!isAuthChecked) {
  //   console.log("[ IS AUTHENTICATED VALUE ]:", isAuthenticated);

  //   if (isAuthenticated) {
  //     router.replace("/(app)/(tabs)/discover");
  //   } else {
  //     router.canDismiss() && router.dismissAll();
  //     router.replace("/(auth)/login");
  //     // router.push("/onboarding/onboarding-one");
  //   }
  //   // }
  // }, [isAuthenticated]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // useEffect(() => {
  //   const handleNotifications = () => {
  //     try {
  //       updateDeviceToken({ deviceToken: expoPushToken });
  //       resetBadgeCount();
  //     } catch (e) {}
  //   };
  //   handleNotifications();
  // }, [isAuthenticated]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" redirect />
      <Stack.Screen name="(app)" options={{ animation: "none" }} />
      <Stack.Screen name="(auth)" options={{ animation: "none" }} />
    </Stack>
  );
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();

  const migration = (oldRealm: Realm, newRealm: Realm) => {
    try {
      if (oldRealm.schemaVersion < 1) {
        const oldObjects = oldRealm.objects("Message");
        const newObjects = newRealm.objects("Message");
      }
    } catch (error) {
      alert(`REALM MIGRATION ERROR: ${error}`);
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
