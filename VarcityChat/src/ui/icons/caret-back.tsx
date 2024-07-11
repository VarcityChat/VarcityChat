import { Svg, Path, SvgProps } from "react-native-svg";

export const CaretBack = ({ ...props }: SvgProps) => {
  return (
    <Svg width="8" height="14" viewBox="0 0 8 14" fill="none" {...props}>
      <Path
        d="M5.97999 0.319993L2.76999 3.52999L0.79999 5.48999C-0.0300097 6.31999 -0.0300097 7.66999 0.79999 8.49999L5.97999 13.68C6.65999 14.36 7.81999 13.87 7.81999 12.92V7.30999V1.07999C7.81999 0.119992 6.65999 -0.360007 5.97999 0.319993Z"
        fill="#9CA1AA"
      />
    </Svg>
  );
};
