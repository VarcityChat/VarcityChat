import { TouchableOpacity } from "@/ui";
import { CaretBack } from "@/ui/icons/caret-back";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export default function BackButton({
  onPress,
  className,
}: {
  onPress: () => void;
  className?: string;
}) {
  const buttonStyle = useMemo(
    () =>
      twMerge(
        "flex w-[35px] h-[35px] justify-center items-center bg-grey-50 dark:bg-grey-800 rounded-md",
        className
      ),
    [className]
  );

  return (
    <TouchableOpacity className={buttonStyle} onPress={onPress}>
      <CaretBack />
    </TouchableOpacity>
  );
}
