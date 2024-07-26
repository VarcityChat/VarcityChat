import { MotiView } from "moti";
import { useCallback } from "react";
import { Pressable, type PressableProps } from "react-native";
import { Svg, Path } from "react-native-svg";

import colors from "./colors";
import { Text } from "./text";

const SIZE = 20;
const WIDTH = 50;
const HEIGHT = 28;
const THUMB_HEIGHT = 22;
const THUMB_WIDTH = 22;
const THUMB_OFFSET = 4;

export interface RootProps extends Omit<PressableProps, "onPress"> {
  onChange: (checked: boolean) => void;
  checked?: boolean;
  className?: string;
  accessibilityLabel: string;
}

export type IconProps = {
  checked: boolean;
};

export const Root = ({
  checked = false,
  children,
  onChange,
  disabled,
  className = "",
  ...props
}: RootProps) => {
  const handleChange = useCallback(() => {
    onChange(!checked);
  }, [onChange, checked]);

  return (
    <Pressable
      onPress={handleChange}
      className={`flex-row items-center ${className} ${
        disabled ? "opacity-50" : ""
      }`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Pressable>
  );
};

type LabelProps = {
  text: string;
  className?: string;
};

const Label = ({ className, text }: LabelProps) => {
  return <Text className={`${className} pl-2`}>{text}</Text>;
};

export const CheckboxIcon = ({ checked }: IconProps) => {
  const color = checked ? colors.primary[600] : colors.charcoal[400];

  return (
    <MotiView
      style={{ height: SIZE, width: SIZE, borderColor: color }}
      className="items-center justify-center rounded-[5px] border-2"
      from={{ backgroundColor: "transparent", borderColor: "#CCCFD6" }}
      animate={{
        backgroundColor: checked ? color : "transparent",
        borderColor: color,
      }}
      transition={{
        backgroundColor: { type: "timing", duration: 100 },
        borderColor: { type: "timing", duration: 100 },
      }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: checked ? 1 : 0 }}
        transition={{ opacity: { type: "timing", duration: 100 } }}
      >
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="m16.726 7-.64.633c-2.207 2.212-3.878 4.047-5.955 6.158l-2.28-1.928-.69-.584L6 12.66l.683.577 2.928 2.477.633.535.591-.584c2.421-2.426 4.148-4.367 6.532-6.756l.633-.64L16.726 7Z"
            fill="#fff"
          />
        </Svg>
      </MotiView>
    </MotiView>
  );
};

const CheckboxRoot = ({ checked = false, children, ...props }: RootProps) => {
  return (
    <Root checked={checked} accessibilityRole="checkbox" {...props}>
      {children}
    </Root>
  );
};

const CheckboxBase = ({
  checked = false,
  label,
  ...props
}: RootProps & { label?: string }) => {
  return (
    <CheckboxRoot checked={checked} {...props}>
      <CheckboxIcon checked={checked} />
      {label ? <Label text={label} className="pr-2" /> : null}
    </CheckboxRoot>
  );
};

export const Checkbox = Object.assign(CheckboxBase, {
  Icon: CheckboxIcon,
  Root: CheckboxRoot,
  Label,
});
