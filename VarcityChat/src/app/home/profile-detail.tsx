import Header from "@/components/header";
import SettingsItem from "@/components/settings/settings-item";
import { View } from "@/ui";
import { useRouter } from "expo-router";

export default function ProfileDetail() {
  const router = useRouter();
  return (
    <View className="flex-1">
      <Header title="Profile">
        <View className="flex flex-1 px-6 mt-6">
          <SettingsItem
            name="profile"
            label="Personal Information"
            onPress={() => router.push("/home/personal-information")}
          />
          <SettingsItem
            name="profile"
            label="Personality"
            onPress={() => router.push("/home/personality")}
          />
          <SettingsItem name="delete" label="Delete account" />
        </View>
      </Header>
    </View>
  );
}
