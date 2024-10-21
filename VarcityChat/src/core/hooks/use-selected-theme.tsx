import { colorScheme, useColorScheme } from "nativewind";
import { useCallback, useState } from "react";

const SELECTED_THEME = "SELECTED_THEME";
export type ColorSchemeType = "light" | "dark" | "system";

export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  // use some form of persistent storage
  const [theme, _setTheme] = useState("");

  const setSelectedTheme = useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
    },
    [setColorScheme, _setTheme]
  );

  const selectedTheme = (theme ?? "system") as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

// to be used in root file to load the selected themee from MMKV
export const loadSelectedTheme = () => {
  // const theme = storage
  const theme = "system";
  if (theme !== undefined) {
    console.log("theme", theme);
    colorScheme.set(theme as ColorSchemeType);
  }
};
