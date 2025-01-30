import Header from "@/components/header";
import SettingsItem from "@/components/settings/settings-item";
import { Modal, View, Text, Button, colors, useModal, Input } from "@/ui";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { forwardRef, useMemo } from "react";

const DeleteAccountModal = forwardRef<BottomSheetModal, {}>(({}, ref) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const snapPoints = useMemo(() => [420], []);

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
        <Text className="font-semibold text-lg">Delete account</Text>
        <Text className="text-grey-500">
          Are you sure you want to delete your account? This action cannot be
          reversed and all your information would be removed
        </Text>

        <View className="flex flex-1 mt-8">
          <Text className="mb-2">Confirm Password</Text>
          <BottomSheetTextInput
            secureTextEntry={true}
            className="h-[44px] bg-grey-50 rounded-md mb-8 px-4 dark:bg-grey-800 dark:text-white"
          />
          <Button label="Delete" />
          <Button label="Go back" variant="tertiary" />
        </View>
      </View>
    </Modal>
  );
});

export default function ProfileDetail() {
  const router = useRouter();
  const deleteModal = useModal();

  return (
    <View className="flex-1">
      <Header title="Profile">
        <View className="flex flex-1 px-6 mt-6">
          <SettingsItem
            name="profile"
            label="Personal Information"
            onPress={() => router.push("/personal-information")}
          />
          <SettingsItem
            name="profile"
            label="Personality"
            onPress={() => router.push("/personality")}
          />
          <SettingsItem
            name="delete"
            label="Delete account"
            onPress={deleteModal.present}
          />
        </View>
      </Header>

      <DeleteAccountModal ref={deleteModal.ref} />
    </View>
  );
}
