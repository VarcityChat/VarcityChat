import { View, TouchableOpacity } from "@/ui";
import { CaretBack } from "@/ui/icons/caret-back";

export default function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      className="flex w-[35px] h-[35px] justify-center items-center bg-grey-50 dark:bg-grey-800 rounded-md"
      onPress={onPress}
    >
      <CaretBack />
    </TouchableOpacity>
  );
}
