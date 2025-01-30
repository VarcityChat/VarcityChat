const colors = require("./src/ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["PlusJakartaSans_400Regular", "PlusJakartaSans"],
        "sans-thin": ["PlusJakartaSans_200Light_Italic", "PlusJakartaSans"],
        "sans-thin-italic": [
          "PlusJakartaSans_200Light_Italic",
          "PlusJakartaSans",
        ],
        "sans-light": ["PlusJakartaSans_300Light", "PlusJakartaSans"],
        "sans-light-italic": [
          "PlusJakartaSans_300Light_Italic",
          "PlusJakartaSans",
        ],
        "sans-regular": ["PlusJakartaSans_400Regular", "PlusJakartaSans"],
        "sans-regular-italic": [
          "PlusJakartaSans_400Regular_Italic",
          "PlusJakartaSans",
        ],
        "sans-medium": ["PlusJakartaSans_500Medium", "PlusJakartaSans"],
        "sans-medium-italic": [
          "PlusJakartaSans_500Medium_Italic",
          "PlusJakartaSans",
        ],
        "sans-bold": ["PlusJakartaSans_700Bold", "PlusJakartaSans"],
        "sans-bold-italic": [
          "PlusJakartaSans_700Bold_Italic",
          "PlusJakartaSans",
        ],
        "sans-semibold": ["PlusJakartaSans_600SemiBold", "PlusJakartaSans"],
        "sans-semibold-italic": [
          "PlusJakartaSans_600SemiBold_Italic",
          "PlusJakartaSans",
        ],
        "sans-black": ["PlusJakartaSans_800ExtraBold", "PlusJakartaSans"],
        "sans-black-italic": [
          "PlusJakartaSans_800ExtraBold_Italic",
          "PlusJakartaSans",
        ],
      },
    },
  },
  plugins: [],
};
