import Svg, { Path, SvgProps } from "react-native-svg";

const FilterSvg = (props: SvgProps) => (
  <Svg width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
    <Path
      d="M4.375 6.875H10.625V8.125H4.375V6.875ZM2.5 4.375H12.5V5.625H2.5V4.375ZM6.25 9.375H8.75V10.625H6.25V9.375Z"
      fill={props.color || "#6B7280"}
    />
  </Svg>
);
export default FilterSvg;
