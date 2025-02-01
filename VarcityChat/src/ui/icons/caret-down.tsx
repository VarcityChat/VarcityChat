import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";

export const CaretDown = ({ ...props }: SvgProps & { error?: boolean }) => (
  <Svg
    width={12}
    height={13}
    fill="none"
    className={`stroke-black dark:stroke-white ${
      props?.error ? "stroke-red-500" : ""
    }`}
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.75 4.744 6 8.494l-3.75-3.75"
    />
  </Svg>
);
