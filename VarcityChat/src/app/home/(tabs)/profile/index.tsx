import SettingsItem from "@/components/settings/settings-item";
import ThemeSelect from "@/components/settings/theme-select";
import { View, Text, Image, Modal, colors, useModal, Button } from "@/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { forwardRef, useMemo } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import LogoutIcon from "@/ui/icons/settings/logout-icon";
const avatar1 = require("../../../../../assets/images/avatars/avatar1.png");

const LogoutModal = forwardRef<BottomSheetModal, {}>(({}, ref) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const snapPoints = useMemo(() => [300], []);

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
        <Text className="font-semibold text-lg">Logout</Text>
        <Text className="text-grey-500">
          Do you want to log-out of your account?
        </Text>

        <View className="flex flex-1 mt-8">
          <Button label="Log out" />
          <Button label="Go back" variant="tertiary" />
        </View>
      </View>
    </Modal>
  );
});

export default function ProfileScreen() {
  const router = useRouter();
  const logoutModal = useModal();

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView className="flex">
        <View className="flex flex-1 items-center">
          <Text className="font-semibold text-lg mt-10 mb-4">Profile</Text>

          <View className="w-[80px] h-[80px] rounded-full overflow-hidden mb-2">
            <Image
              source={avatar1}
              className="w-full h-full object-cover rounded-full"
            />
          </View>
          <Text className="font-semibold text-lg">Ebuka Varcity</Text>
          <Text className="text-sm text-grey-500 dark:text-grey-200">
            Lead City University
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
              router.push("home/profile-detail");
            }}
          />

          <SettingsItem name="activeStatus" label="Active Status" hasSwitch />

          <SettingsItem name="notifications" label="Notifications" hasSwitch />

          <ThemeSelect />

          <SettingsItem name="tellafriend" label="Tell a friend" />

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
            <Text className="text-primary-600 dark:text-primary-600">
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LogoutModal ref={logoutModal.ref} />
    </SafeAreaView>
  );
}
