import { View } from "@/ui";
import { SafeAreaView } from "react-native";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "nativewind";
import { HEIGHT } from "@/ui";

const CARD_HEIGHT = HEIGHT / 3;

export default function StudentsListSkeleton() {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex flex-1">
      <View className="px-6 flex-1">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-4">
          <Skeleton
            colorMode={colorScheme}
            height={40}
            width={40}
            radius={20}
          />
          <Skeleton
            colorMode={colorScheme}
            height={24}
            width={200}
            radius={4}
          />
          <Skeleton colorMode={colorScheme} height={40} width={65} radius={8} />
        </View>

        {/* Search Bar */}
        <Skeleton
          colorMode={colorScheme}
          height={44}
          width="100%"
          radius={12}
        />

        {/* User Cards */}
        {[...Array(3)].map((_, index) => (
          <View key={index} className="mt-8">
            <View style={{ height: CARD_HEIGHT }} className="relative">
              <Skeleton
                colorMode={colorScheme}
                height={CARD_HEIGHT}
                width="100%"
                radius={12}
              />

              {/* Bottom content overlay */}
              <View className="absolute bottom-0 w-full px-4 py-3">
                <View className="flex-row gap-2 mb-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      colorMode={colorScheme}
                      height={16}
                      width={60}
                      radius={4}
                    />
                  ))}
                </View>
                <Skeleton
                  colorMode={colorScheme}
                  height={24}
                  width={150}
                  radius={4}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
