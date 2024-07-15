import Svg, { Path, SvgProps } from "react-native-svg";

const Discover = ({ color = "#6B7280", ...props }: SvgProps) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M22.5 12C22.5 6.48 18.02 2 12.5 2C6.98 2 2.5 6.48 2.5 12C2.5 17.52 6.98 22 12.5 22"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5001 3H9.5001C7.5501 8.84 7.5501 15.16 9.5001 21H8.5001"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.5 3C16.47 5.92 16.96 8.96 16.96 12"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 16V15C6.42 15.97 9.46 16.46 12.5 16.46"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 8.99961C9.34 7.04961 15.66 7.04961 21.5 8.99961"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.7 21.4C20.4673 21.4 21.9 19.9673 21.9 18.2C21.9 16.4327 20.4673 15 18.7 15C16.9327 15 15.5 16.4327 15.5 18.2C15.5 19.9673 16.9327 21.4 18.7 21.4Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22.5 22L21.5 21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Discover;
