import { View, Text } from "@/ui";
import { ReactNode } from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./back-button";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
}

export const HEADER_HEIGHT = 60;

export default function Header({ title, headerRight, children }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: withTiming(scrollY.value > 0 ? 0.5 : 0, {
        duration: 300,
      }),
      elevation: withTiming(scrollY.value > 0 ? 4 : 0, { duration: 300 }),
    };
  });

  return (
    <View className="flex-1">
      <Animated.View
        className="absolute top-0 left-0 right-0 bg-white z-10 border-b-grey-100"
        style={[
          headerStyle,
          { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top },
        ]}
      >
        <View className="flex flex-row items-center justify-between py-4 px-6">
          <View className="flex-1">
            <BackButton
              onPress={() => {
                router.canGoBack() && router.back();
              }}
            />
          </View>
          <View className="items-center">
            <Text className="font-semibold text-lg">{title}</Text>
          </View>
          <View className="flex-1 items-end">{headerRight}</View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
      >
        {/* Content Goes Here */}
        {children}
      </Animated.ScrollView>
    </View>
  );
}
