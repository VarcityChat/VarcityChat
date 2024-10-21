import { TouchableOpacity, Pressable } from "react-native";
import { Text, View } from "@/ui";
import { CaretUp } from "@/ui/icons/caret-up";
import { CaretDown } from "@/ui/icons/caret-down";
import { useCallback, useState } from "react";
import { CheckboxIcon } from "@/ui/checkbox";
import ThemeIcon from "@/ui/icons/settings/theme-icon";
import {
  ColorSchemeType,
  useSelectedTheme,
} from "@/core/hooks/use-selected-theme";

export default function ThemeSelect() {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const [showSelectThemeToggle, setShowSelectThemeToggle] = useState(false);

  const onSelect = useCallback(
    (t: ColorSchemeType) => {
      setSelectedTheme(t);
    },
    [setSelectedTheme]
  );

  return (
    <View className="flex mb-2 py-2">
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex flex-row flex-1 items-center pr-4"
        onPress={() => setShowSelectThemeToggle((prev) => !prev)}
      >
        <View className="flex-row gap-4 items-center">
          <ThemeIcon />
          <Text className="flex-1">Theme</Text>
        </View>
        {showSelectThemeToggle ? <CaretUp /> : <CaretDown />}
      </TouchableOpacity>

      {showSelectThemeToggle && (
        <View className="flex flex-row gap-7 pt-6 px-4">
          <ThemeSelectItem
            label="Light"
            selectedTheme={selectedTheme}
            onSelect={() => onSelect("light")}
          />
          <ThemeSelectItem
            label="Dark"
            selectedTheme={selectedTheme}
            onSelect={() => onSelect("dark")}
          />
          <ThemeSelectItem
            label="System"
            selectedTheme={selectedTheme}
            onSelect={() => onSelect("system")}
          />
        </View>
      )}
    </View>
  );
}

function ThemeSelectItem({
  selectedTheme,
  onSelect,
  label,
}: {
  selectedTheme: ColorSchemeType;
  onSelect: () => void;
  label: string;
}) {
  return (
    <Pressable className="flex flex-row gap-2" onPress={onSelect}>
      <CheckboxIcon checked={selectedTheme === label.toLowerCase()} />
      <Text className="font-light">{label}</Text>
    </Pressable>
  );
}
