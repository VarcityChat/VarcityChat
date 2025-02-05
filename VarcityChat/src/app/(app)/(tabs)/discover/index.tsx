import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  colors,
  List,
  IS_IOS,
} from "@/ui";
import { useRouter } from "expo-router";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { universities } from "../../../../../constants/unis";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationSvg from "@/ui/icons/location";
import SearchBar from "@/components/search-bar";
import NotificationSvg from "@/ui/icons/notification";
import { useEffect, useCallback } from "react";

const HEADER_HEIGHT =
  Platform.OS === "ios" ? 110 : 70 + (StatusBar?.currentHeight ?? 0);
const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger header animation

export default function DiscoverScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Track scroll position and direction
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerVisible = useSharedValue(1);

  // Reset header state when screen comes into focus
  useEffect(() => {
    headerVisible.value = withTiming(1, { duration: 300 });
    scrollY.value = 0;
    lastScrollY.value = 0;
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const scrollDiff = currentScrollY - lastScrollY.value;

      // Only update header visibility after passing threshold
      if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
        // Scrolling up - hide header
        if (scrollDiff > 0 && currentScrollY > HEADER_HEIGHT) {
          headerVisible.value = withTiming(0, { duration: 100 });
        }
        // Scrolling down - show header
        else if (scrollDiff < 0 || currentScrollY <= 0) {
          headerVisible.value = withTiming(1, { duration: 100 });
        }
      }

      scrollY.value = currentScrollY;
      lastScrollY.value = currentScrollY;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      headerVisible.value,
      [0, 1],
      [-HEADER_HEIGHT, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity: interpolate(
        headerVisible.value,
        [0, 1],
        [0.8, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  const renderUniversityItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <TouchableOpacity
          onPress={() => router.push("/university/lead-city")}
          activeOpacity={0.7}
          className={`flex flex-1 h-[130px] mb-8 
          ${(index + 1) % 3 === 0 ? "ml-2" : ""}
          ${(index + 1) % 3 === 1 ? "mr-2" : ""}
          ${(index + 1) % 3 === 2 ? "mx-1" : ""}
        `}
        >
          <View className="w-full h-[90] bg-grey-50 rounded-md dark:bg-grey-800 items-center justify-center">
            {item.image ? (
              <Image
                source={item.image}
                className="w-[60] h-[60] object-contain"
              />
            ) : null}
          </View>
          <View className="mt-2">
            <Text className="font-sans-semibold">{item.name}</Text>
            <View className="flex flex-row items-center">
              <LocationSvg className="mr-1" />
              <Text className="text-sm text-grey-500 dark:text-grey-200 font-sans">
                {item.location.substring(0, 12) +
                  (item.location.length > 12 ? "..." : "")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [router]
  );

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
          headerAnimatedStyle,
        ]}
      >
        <View
          className="flex flex-1 flex-row justify-between items-center px-6"
          style={{ marginTop: insets.top }}
        >
          <Text className="font-sans-semibold text-xl text-primary-600 dark:text-primary-600">
            Varcity Chat
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-grey-50"
            onPress={() => router.push("/notifications")}
          >
            <NotificationSvg />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        className="flex flex-1 flex-grow px-6 pt-4"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ paddingTop: IS_IOS ? insets.top : HEADER_HEIGHT }}
      >
        <View
          className={`${Platform.select({ ios: "pt-0", android: "pt-4" })}`}
        >
          <SearchBar placeholder="Discover more people here" />
        </View>
        <List
          ListHeaderComponent={
            <Text className="mb-4 font-sans-bold text-lg">
              List of Universities
            </Text>
          }
          data={[...universities]}
          keyExtractor={(_, index) => `university-${index}`}
          renderItem={renderUniversityItem}
          numColumns={3}
          contentContainerClassName="flex flex-1 flex-grow"
          estimatedItemSize={50}
          ListFooterComponent={<View style={{ height: 150 }} />}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
