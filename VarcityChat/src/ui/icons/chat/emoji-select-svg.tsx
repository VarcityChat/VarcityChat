import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const EmojiSelectSvg = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.5 9.75C16.3284 9.75 17 9.07843 17 8.25C17 7.42157 16.3284 6.75 15.5 6.75C14.6716 6.75 14 7.42157 14 8.25C14 9.07843 14.6716 9.75 15.5 9.75Z"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 9.75C9.32843 9.75 10 9.07843 10 8.25C10 7.42157 9.32843 6.75 8.5 6.75C7.67157 6.75 7 7.42157 7 8.25C7 9.07843 7.67157 9.75 8.5 9.75Z"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.4 13.2998H15.6C16.1 13.2998 16.5 13.6998 16.5 14.1998C16.5 16.6898 14.49 18.6998 12 18.6998C9.51 18.6998 7.5 16.6898 7.5 14.1998C7.5 13.6998 7.9 13.2998 8.4 13.2998Z"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default EmojiSelectSvg;
