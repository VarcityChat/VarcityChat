import SearchBar from "@/components/search-bar";
import { View, Text, TouchableOpacity, IS_IOS, colors, List } from "@/ui";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { users } from "../../../../constants/users";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { trimText } from "@/core/utils";
import BackButton from "@/components/back-button";
import UserCard from "@/components/university/user-card";
import FilterSvg from "@/ui/icons/university/filter-svg";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Checkbox } from "@/ui/checkbox";

const HEADER_HEIGHT =
  Platform.OS === "ios" ? 110 : 70 + (StatusBar?.currentHeight ?? 0);
const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger header animation

export default function University() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");

  // Track scroll position and direction
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerVisible = useSharedValue(1);

  // Reset header state when screen comes into focus
  useEffect(() => {
    headerVisible.value = withTiming(1, { duration: 500 });
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

  useEffect(() => {
    headerVisible.value = withTiming(1, { duration: 500 });
    scrollY.value = 0;
    lastScrollY.value = 0;
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
          headerAnimatedStyle,
        ]}
      >
        <View
          className="flex flex-1 flex-row items-center justify-between px-6 pb-3"
          style={{ marginTop: insets.top }}
        >
          <View className="w-[65px]">
            <BackButton onPress={() => router.canGoBack() && router.back()} />
          </View>

          <Text className="font-sans-semibold text-lg">
            {trimText("Lead City University")}
          </Text>

          <Menu opened={popupOpen} onBackdropPress={() => setPopupOpen(false)}>
            <MenuTrigger customStyles={{ triggerOuterWrapper: { zIndex: 10 } }}>
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center justify-center h-[40px] w-[65px] rounded-md bg-white dark:bg-charcoal-950 border border-grey-100"
                onPress={() => setPopupOpen(true)}
              >
                <Text className="text-grey-500 mr-1">filter</Text>
                <FilterSvg color={isDark ? "#fff" : "#6B7280"} />
              </TouchableOpacity>
            </MenuTrigger>

            <MenuOptions
              customStyles={{
                optionsContainer: {
                  width: 140,
                  borderRadius: 10,
                  backgroundColor: isDark ? colors.charcoal[950] : colors.white,
                },
                optionsWrapper: {
                  padding: 4,
                },
                optionWrapper: {
                  marginTop: 10,
                },
              }}
            >
              <MenuOption>
                <Checkbox.Root
                  accessibilityLabel="filter male"
                  onChange={() => {
                    setFilter("all");
                  }}
                >
                  <Checkbox.Icon checked={filter === "all"} />
                  <Checkbox.Label text="All"></Checkbox.Label>
                </Checkbox.Root>
              </MenuOption>
              <MenuOption>
                <Checkbox.Root
                  accessibilityLabel="filter male"
                  onChange={() => setFilter("male")}
                >
                  <Checkbox.Icon checked={filter === "male"} />
                  <Checkbox.Label text="Male" />
                </Checkbox.Root>
              </MenuOption>
              <MenuOption>
                <Checkbox.Root
                  accessibilityLabel="filter female"
                  onChange={() => setFilter("female")}
                  className="mb-2"
                >
                  <Checkbox.Icon checked={filter === "female"} />
                  <Checkbox.Label text="Female" />
                </Checkbox.Root>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </Animated.View>

      <Animated.ScrollView
        className="flex flex-1 flex-grow px-6"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ paddingTop: IS_IOS ? insets.top : HEADER_HEIGHT }}
      >
        <SearchBar
          placeholder="Search for people here"
          onTouchEnd={() => router.push("/university/search")}
        />

        <List
          data={[...users]}
          keyExtractor={(_, index) => `university-${index}`}
          renderItem={({ item }) => {
            return <UserCard user={item} />;
          }}
          contentContainerClassName="flex flex-1 flex-grow"
          estimatedItemSize={150}
          ListFooterComponent={<View style={{ height: 150 }} />}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
