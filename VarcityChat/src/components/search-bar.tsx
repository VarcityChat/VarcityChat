import { View, colors } from "@/ui";
import { Platform, TextInput, TextInputProps } from "react-native";
import InspectSvg from "@/ui/icons/inspect";

export default function SearchBar({ placeholder, ...props }: TextInputProps) {
  return (
    <View
      className={`flex flex-row items-center h-[44px] w-full rounded-xl bg-grey-50 mb-6 px-4 dark:bg-grey-800`}
    >
      <InspectSvg />
      <View className="h-[18px] w-[1px] bg-grey-300 mx-4"></View>
      <TextInput
        placeholderTextColor={colors.grey["300"]}
        className=" h-[44px] py-2 flex flex-1 font-inter text-base leading-5 dark:text-white font-sans"
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
}
