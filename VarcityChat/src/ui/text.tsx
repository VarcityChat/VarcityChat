import type { TextProps } from "react-native";
import { useMemo } from "react";
import { Text as NText } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props extends TextProps {
  className?: string;
}

export function Text({ className = "", style, children, ...props }: Props) {
  const textStyle = useMemo(
    () => twMerge("text-base text-black dark:text-white font-sans", className),
    [className]
  );

  return (
    <NText className={textStyle} style={style} {...props}>
      {children}
    </NText>
  );
}
