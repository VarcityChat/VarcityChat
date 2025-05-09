import SettingsItem from "@/components/settings/settings-item";
import ThemeSelect from "@/components/settings/theme-select";
import { View, Text, Image, Modal, colors, useModal, Button } from "@/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import LogoutIcon from "@/ui/icons/settings/logout-icon";
import { useAuth } from "@/core/hooks/use-auth";
import { defaultAvatarUrl } from "../../../../../constants/chats";
import { capitalize } from "@/core/utils";
import { IUniversity } from "@/api/universities/types";
import { IUser } from "@/types/user";
import { useDebounce } from "@/core/hooks/use-debounce";
import { useUpdateUserStatusMutation } from "@/api/auth/auth-api";
import { useApi } from "@/core/hooks/use-api";
import { useToast } from "@/core/hooks/use-toast";

const LogoutModal = forwardRef<BottomSheetModal, { dismissModal: () => void }>(
  ({ dismissModal }, ref) => {
    const { colorScheme } = useColorScheme();
    const { logout } = useAuth();
    const isDark = colorScheme === "dark";
    const snapPoints = useMemo(() => [300], []);

    const handleLogout = () => {
      logout();
      dismissModal?.();
    };

    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        showCancelButton={false}
        backgroundStyle={{
          backgroundColor: isDark ? colors.neutral[800] : colors.white,
        }}
      >
        <View className="flex flex-1 px-6 py-2">
          <Text className="font-sans-semibold text-lg">Logout</Text>
          <Text className="text-grey-500 text-base">
            Do you want to log-out of your account?
          </Text>

          <View className="flex flex-1 mt-8">
            <Button label="Log out" onPress={handleLogout} />
            <Button label="Go back" variant="tertiary" />
          </View>
        </View>
      </Modal>
    );
  }
);

export default function ProfileScreen() {
  const router = useRouter();
  const logoutModal = useModal();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { callMutationWithErrorHandler } = useApi();
  const [updateUserStatus, { isLoading: isUpdatingUserStatus }] =
    useUpdateUserStatusMutation();

  const [activeStatus, setActiveStatus] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);

  const [debouncedStatusUpdate, cancelDebouncedStatusUpdate] = useDebounce(
    async (settings: IUser["settings"]) => {
      const { isError } = await callMutationWithErrorHandler(() =>
        updateUserStatus(settings)
      );
      if (!isError) {
        showToast({
          type: "success",
          text1: "Success",
          text2: "Your status has been updated",
        });
      }
    },
    1000
  );

  useEffect(() => {
    setActiveStatus(user?.settings.activeStatus ?? true);
    setNotificationsEnabled(user?.settings.notificationsEnabled ?? true);
  }, [user]);

  const handleActiveStatusChange = (value: boolean) => {
    setActiveStatus(value);
    // call api to update status using debounce
    debouncedStatusUpdate({
      activeStatus: value,
      notificationsEnabled: notificationsEnabled,
    });
  };

  const handleActiveNotificationsChange = (value: boolean) => {
    setNotificationsEnabled(value);
    // call api to update status using debounce
    debouncedStatusUpdate({
      activeStatus: activeStatus,
      notificationsEnabled: value,
    });
  };

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView className="flex">
        <View className="flex flex-1 items-center">
          <Text className="font-sans-bold text-lg mt-10 mb-4">Profile</Text>

          <View className="w-[80px] h-[80px] rounded-full overflow-hidden mb-2">
            <Image
              source={{ uri: user?.images[0] || defaultAvatarUrl }}
              className="w-full h-full object-cover rounded-full"
            />
          </View>
          <Text className="font-semibold text-lg">
            {user?.firstname} {user?.lastname}
          </Text>
          <Text className="text-sm text-grey-500 dark:text-grey-200">
            {capitalize((user?.university as IUniversity)?.name)}
          </Text>
        </View>

        <View className="flex flex-1 px-6 mt-10">
          {/* Header */}
          <Text className="text-grey-500 mb-4 dark:text-grey-200">
            Settings
          </Text>

          <SettingsItem
            name="profile"
            label="Profile"
            onPress={() => {
              router.push("/profile-detail");
            }}
          />

          <SettingsItem
            name="activeStatus"
            label="Active Status"
            hasSwitch
            switchValue={activeStatus}
            onSwitchValueChange={handleActiveStatusChange}
          />

          <SettingsItem
            name="notifications"
            label="Notifications"
            hasSwitch
            switchValue={notificationsEnabled}
            onSwitchValueChange={handleActiveNotificationsChange}
          />

          <ThemeSelect />

          <SettingsItem
            name="tellafriend"
            label="Tell a friend"
            onPress={() => router.push("/tell-a-friend")}
          />

          {/* Header */}
          <Text className="text-grey-500 mt-8 dark:text-grey-200">Safety</Text>

          <SettingsItem name="tndc" label="Terms and conditions" />

          <SettingsItem name="support" label="Support" />
        </View>

        <View className="flex flex-1 flex-row items-center justify-center my-12">
          <TouchableOpacity
            className="flex flex-row"
            onPress={logoutModal.present}
          >
            <LogoutIcon />
            <Text className="text-primary-600 dark:text-primary-600 font-sans-semibold">
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LogoutModal ref={logoutModal.ref} dismissModal={logoutModal.dismiss} />
    </SafeAreaView>
  );
}
