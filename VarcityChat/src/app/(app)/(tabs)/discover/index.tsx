import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
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
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useCallback, useState } from "react";
import { useGetUniversitiesQuery } from "@/api/universities/university-api";
import { IUniversity } from "@/api/universities/types";
import { capitalize } from "@/core/utils";
import LocationSvg from "@/ui/icons/location";
import SearchBar from "@/components/search-bar";
import NotificationSvg from "@/ui/icons/notification";
import UniversitySkeleton from "@/components/university/university-skeleton";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { setHasNotification } from "@/core/notifications/notification-slice";

const SCROLL_THRESHOLD = 5; // Minimum scroll distance to trigger header animation

export default function DiscoverScreen() {
  const { colorScheme } = useColorScheme();
  const hasNotification = useAppSelector(
    (state) => state.notifications.hasNotification
  );
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const hasNotch = insets.top > 20;

  const HEADER_HEIGHT =
    Platform.OS === "ios"
      ? hasNotch
        ? 110
        : 70
      : 40 + (StatusBar?.currentHeight ?? 0);

  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [search, setSearch] = useState("");

  // API calls
  const { data: universities, isLoading } = useGetUniversitiesQuery(null, {
    pollingInterval: 30000,
  });

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
    ({ item, index }: { item: IUniversity; index: number }) => {
      return (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/university/[id]",
              params: { id: item._id, name: item.name },
            })
          }
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
                source={{ uri: item?.image }}
                className="w-[50] h-[50] object-contain"
              />
            ) : null}
          </View>
          <View className="mt-2">
            <Text className="font-sans-semibold">{capitalize(item.name)}</Text>
            <View className="flex flex-row items-center">
              <LocationSvg className="mr-1" />
              <Text className="text-sm text-grey-500 dark:text-grey-200 font-sans">
                {item.location?.address
                  ? item.location.address.substring(0, 12) +
                    (item.location.address.length > 12 ? "..." : "")
                  : ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [router, universities]
  );

  const handleNotificationPress = () => {
    dispatch(setHasNotification(false));
    router.push("/notifications");
  };

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
        <View className="flex flex-1 flex-row justify-between items-end px-6 h-full pb-4">
          <Text className="font-sans-semibold text-xl text-primary-600 dark:text-primary-600">
            Varcity Chat
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-grey-50"
            onPress={handleNotificationPress}
          >
            {hasNotification && (
              <View className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-red-500 z-10" />
            )}
            <NotificationSvg />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        className="flex flex-1 flex-grow px-6"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{
          paddingTop: IS_IOS
            ? HEADER_HEIGHT - insets.top + 10
            : HEADER_HEIGHT + 10,
        }}
      >
        <View>
          <SearchBar
            placeholder="Discover more people here"
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        {isLoading ? (
          <UniversitySkeleton />
        ) : (
          <List
            ListHeaderComponent={
              <Text className="mb-4 font-sans-bold text-lg">
                List of Universities
              </Text>
            }
            data={universities?.filter((university) =>
              university.name.toLowerCase().includes(search.toLowerCase())
            )}
            keyExtractor={(_, index) => `university-${index}`}
            renderItem={renderUniversityItem}
            numColumns={3}
            contentContainerClassName="flex flex-1 flex-grow"
            estimatedItemSize={50}
            ListFooterComponent={<View style={{ height: 150 }} />}
          />
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
