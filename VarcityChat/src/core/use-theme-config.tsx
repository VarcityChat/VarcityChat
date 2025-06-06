import type { Theme } from "@react-navigation/native";
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import colors from "@/ui/colors";
import { useMemo } from "react";

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary[600],
    background: colors.charcoal[950],
    text: colors.charcoal[100],
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[600],
    background: colors.white,
  },
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  return useMemo(() => {
    return colorScheme === "dark" ? DarkTheme : LightTheme;
  }, [colorScheme]);
}
