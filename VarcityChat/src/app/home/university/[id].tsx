import SearchBar from "@/components/search-bar";
import { View, Text, TouchableOpacity, IS_IOS, colors, List } from "@/ui";
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

const HEADER_HEIGHT = IS_IOS ? 100 : 70 + (StatusBar?.currentHeight ?? 0);

export default function University() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");

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
          className="flex flex-1 flex-row items-center justify-between px-6 pb-3"
          style={{ marginTop: insets.top }}
        >
          <View className="w-[65px]">
            <BackButton onPress={() => router.canGoBack() && router.back()} />
          </View>

          <Text className="font-semibold text-lg">
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
        <SearchBar placeholder="Search for people here" />

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
