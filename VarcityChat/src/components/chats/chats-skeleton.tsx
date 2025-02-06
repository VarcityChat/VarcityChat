import { View } from "@/ui";
import { SafeAreaView } from "react-native";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "nativewind";

export default function ChatsSkeleton() {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex flex-1">
      <View className="px-6 flex-1">
        <Skeleton
          colorMode={colorScheme}
          height={44}
          width="100%"
          radius={12}
        />

        <View className="flex flex-row mb-6 gap-4 mt-4">
          <Skeleton
            colorMode={colorScheme}
            height={36}
            width={80}
            radius={20}
          />
          <Skeleton
            colorMode={colorScheme}
            height={36}
            width={80}
            radius={20}
          />
        </View>

        {[...Array(6)].map((_, index) => (
          <View key={index}>
            <View className="flex-row items-center mt-3">
              <Skeleton
                colorMode={colorScheme}
                width={40}
                height={40}
                radius={20}
              />
              <View className="flex-1 ml-4">
                <Skeleton
                  colorMode={colorScheme}
                  height={20}
                  width={128}
                  radius={0}
                />
                <View className="mt-2">
                  <Skeleton
                    colorMode={colorScheme}
                    height={16}
                    width={192}
                    radius={0}
                  />
                </View>
              </View>
            </View>
            {index !== 5 && (
              <View className="h-[1px] bg-grey-50 mt-3 mb-5 dark:bg-grey-900" />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
