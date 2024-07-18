import { Text, TouchableOpacity } from "@/ui";
import ActiveSvg from "@/ui/icons/settings/active-icon";
import DeleteIcon from "@/ui/icons/settings/delete-icon";
import NotificationsSvg from "@/ui/icons/settings/notifications-icon";
import ProfileSvg from "@/ui/icons/settings/profile-icon";
import SupportIcon from "@/ui/icons/settings/support-icon";
import TellAFriendIcon from "@/ui/icons/settings/tell-a-friend-icon";
import ThemeIcon from "@/ui/icons/settings/theme-icon";
import TermsAndConditionsIcon from "@/ui/icons/settings/tndc-icon";
import React from "react";
import { Switch } from "react-native";

type iconNames =
  | "profile"
  | "activeStatus"
  | "tndc"
  | "support"
  | "notifications"
  | "theme"
  | "tellafriend"
  | "delete";

const svgMap: Record<iconNames, any> = {
  profile: <ProfileSvg />,
  activeStatus: <ActiveSvg />,
  tndc: <TermsAndConditionsIcon />,
  support: <SupportIcon />,
  notifications: <NotificationsSvg />,
  theme: <ThemeIcon />,
  tellafriend: <TellAFriendIcon />,
  delete: <DeleteIcon />,
};

export default function SettingsItem({
  name,
  label,
  hasSwitch = false,
  onPress,
}: {
  name: iconNames;
  label: string;
  hasSwitch?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex flex-row flex-1 items-center gap-4 mb-2 py-2"
      onPress={onPress}
    >
      {svgMap[name]}
      <Text className="flex-1">{label}</Text>
      {hasSwitch && <Switch />}
    </TouchableOpacity>
  );
}
