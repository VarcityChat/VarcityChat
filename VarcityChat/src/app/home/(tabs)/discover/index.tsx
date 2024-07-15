import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  colors,
  List,
} from "@/ui";
import { useRoute } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { universities } from "../../../../../constants/unis";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationSvg from "@/ui/icons/location";
import SearchBar from "@/components/search-bar";
import NotificationSvg from "@/ui/icons/notification";

const HEADER_HEIGHT =
  Platform.OS === "ios" ? 100 : 70 + (StatusBar?.currentHeight ?? 0);

export default function DiscoverScreen() {
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
          <Text className="font-semibold text-xl text-primary-600 dark:text-primary-600">
            Varcity Chat
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-grey-50"
            onPress={() => router.push("/home/notifications")}
          >
            <NotificationSvg />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        className="flex flex-1 flex-grow px-6"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ paddingTop: HEADER_HEIGHT - insets.top }}
      >
        <SearchBar placeholder="Discover more people here" />
        <List
          ListHeaderComponent={
            <Text className="mb-4 font-bold text-lg">List of Universities</Text>
          }
          data={[...universities]}
          keyExtractor={(_, index) => `university-${index}`}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
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
          numColumns={3}
          contentContainerClassName="flex flex-1 flex-grow"
          estimatedItemSize={50}
          ListFooterComponent={<View style={{ height: 150 }} />}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
