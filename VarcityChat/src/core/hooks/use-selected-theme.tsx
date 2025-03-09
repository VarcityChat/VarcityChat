import { colorScheme, useColorScheme } from "nativewind";
import { useCallback, useState } from "react";
import { getItem, setItem } from "../storage";

const SELECTED_THEME = "SELECTED_THEME";
export type ColorSchemeType = "light" | "dark" | "system";

export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, _setTheme] = useState<ColorSchemeType>(() => {
    const savedTheme = getItem(SELECTED_THEME);
    return (savedTheme as ColorSchemeType) || "system";
  });

  const setSelectedTheme = useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
      setItem(SELECTED_THEME, t);
    },
    [setColorScheme]
  );

  const selectedTheme = (theme ?? "system") as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

// to be used in root file to load the selected themee from MMKV
export const loadSelectedTheme = () => {
  const theme = getItem(SELECTED_THEME) as ColorSchemeType | undefined;
  if (theme) {
    colorScheme.set(theme);
  } else {
    colorScheme.set("system");
  }
};
