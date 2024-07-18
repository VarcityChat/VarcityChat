import Header from "@/components/header";
import SettingsItem from "@/components/settings/settings-item";
import { View, Text } from "@/ui";

export default function ProfileDetail() {
  return (
    <View className="flex-1">
      <Header title="Profile">
        <View className="flex flex-1 px-6 mt-6">
          <SettingsItem name="profile" label="Personal Information" />
          <SettingsItem name="profile" label="Personality" />
          <SettingsItem name="delete" label="Delete account" />
        </View>
      </Header>
    </View>
  );
}
