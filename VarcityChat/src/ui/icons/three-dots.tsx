import { useColorScheme } from "nativewind";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ThreeDotsSvg = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Svg width={4} height={14} viewBox="0 0 4 14" fill="none" {...props}>
      <Path
        d="M2 2.25C2.41421 2.25 2.75 1.91421 2.75 1.5C2.75 1.08579 2.41421 0.75 2 0.75C1.58579 0.75 1.25 1.08579 1.25 1.5C1.25 1.91421 1.58579 2.25 2 2.25Z"
        stroke={isDark ? "#BBBEC5" : "black"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 7.75C2.41421 7.75 2.75 7.41421 2.75 7C2.75 6.58579 2.41421 6.25 2 6.25C1.58579 6.25 1.25 6.58579 1.25 7C1.25 7.41421 1.58579 7.75 2 7.75Z"
        stroke={isDark ? "#BBBEC5" : "black"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 13.25C2.41421 13.25 2.75 12.9142 2.75 12.5C2.75 12.0858 2.41421 11.75 2 11.75C1.58579 11.75 1.25 12.0858 1.25 12.5C1.25 12.9142 1.58579 13.25 2 13.25Z"
        stroke={isDark ? "#BBBEC5" : "black"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
export default ThreeDotsSvg;
