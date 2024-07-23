import SearchBar from "@/components/search-bar";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  IS_IOS,
  colors,
  List,
  HEIGHT,
} from "@/ui";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaView, StatusBar } from "react-native";
import Animated, {
  clamp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { universities } from "../../../../constants/unis";
import LocationSvg from "@/ui/icons/location";
import BackButton from "@/components/back-button";
import { useEffect } from "react";

const HEADER_HEIGHT = IS_IOS ? 100 : 70 + (StatusBar?.currentHeight ?? 0);

export default function University() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx: { prevY: number }) => {
      const diff = event.contentOffset.y - ctx.prevY;
      scrollY.value = clamp(scrollY.value + diff, 0, HEADER_HEIGHT);
    },
    onBeginDrag: (event, ctx: { prevY: number }) => {
      ctx.prevY = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const headerY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT]
    );
    return {
      transform: [{ translateY: headerY }],
    };
  });

  useEffect(() => {
    scrollY.value = 0;
  }, []);

  return (
    <SafeAreaView className="flex flex-1">
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_HEIGHT,
            backgroundColor: isDark ? colors.charcoal[950] : colors.white,
            zIndex: 1000,
            elevation: 1000,
          },
          animatedStyle,
        ]}
      >
        <View
          className="flex flex-1 flex-row justify-between items-end px-6 pb-3"
          style={{ marginTop: insets.top }}
        >
          <BackButton onPress={() => router.canGoBack() && router.back()} />
          <Text className="font-semibold text-lg">Lead City University</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex items-center justify-center h-[30px] rounded-md bg-grey-50"
            onPress={() => router.push("/home/notifications")}
          >
            <Text>filter</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        className="flex flex-1 flex-grow px-6"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ paddingTop: IS_IOS ? insets.top : HEADER_HEIGHT }}
      >
        <SearchBar placeholder="Search for people here" />

        <List
          data={[...universities]}
          keyExtractor={(_, index) => `university-${index}`}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => router.push("/home/discover/lead-city")}
                activeOpacity={0.7}
                className={`flex flex-1 mb-8 bg-grey-50 rounded-md dark:bg-grey-800`}
                style={{ height: HEIGHT / 3.3 }}
              >
                <View className="w-full h-[90] items-center justify-center">
                  {item.image ? (
                    <Image
                      source={item.image}
                      className="w-[60] h-[60] object-contain"
                    />
                  ) : null}
                </View>
                <View className="mt-2">
                  <Text className="font-semibold">{item.name}</Text>
                  <View className="flex flex-row items-center">
                    <LocationSvg className="mr-1" />
                    <Text className="text-sm text-grey-500 dark:text-grey-200">
                      {item.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerClassName="flex flex-1 flex-grow"
          estimatedItemSize={50}
          ListFooterComponent={<View style={{ height: 150 }} />}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
