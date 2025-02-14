import { axiosApiClient } from "@/api/api";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, Text, View } from "@/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { List } from "@/ui";
import { IUser } from "@/types/user";
import { useToast } from "@/core/hooks/use-toast";
import { useRef } from "react";
import { trimText } from "@/core/utils";
import { AxiosResponse } from "axios";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserCard from "@/components/university/user-card";
import StudentsListSkeleton from "@/components/university/students-list-skeleton";
import SearchBar from "@/components/search-bar";
import BackButton from "@/components/back-button";
import BottomSheet from "@gorhom/bottom-sheet";
import FilterSvg from "@/ui/icons/university/filter-svg";

const LIMIT = 20;
const SCROLL_THRESHOLD = 10;

const AnimatedList = Animated.createAnimatedComponent(List<IUser>);

export default function University() {
  const { id: universityId } = useLocalSearchParams();
  const { showToast } = useToast();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasNotch = insets.top > 20;

  const HEADER_HEIGHT =
    Platform.OS === "ios"
      ? hasNotch
        ? 110
        : 70
      : 70 + (StatusBar?.currentHeight ?? 0);

  const page = useRef(1);
  const filterRef = useRef<"all" | "male" | "female">("all");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%"], []);

  const [students, setStudents] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");

  // Track scroll position and direction
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerVisible = useSharedValue(1);

  useEffect(() => {
    headerVisible.value = withTiming(1, { duration: 500 });
    scrollY.value = 0;
    lastScrollY.value = 0;
    fetchStudents(page.current === 1);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
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

  const fetchStudents = async (loadingVisible: boolean) => {
    if (page.current === 0) return;
    try {
      !loadingVisible && setFetching(false);
      const response: AxiosResponse<{
        users: IUser[];
        total: number;
        currentPage: number;
        totalPages: number;
      }> = await axiosApiClient.get(
        `/uni/${universityId}/students?page=${page.current}&limit=${LIMIT}&filter=${filterRef.current}`
      );

      if (response.data) {
        if (response.data.users) {
          setStudents((prev) => {
            const uniqueMap = new Map(
              [...prev, ...response.data.users].map((user) => [user._id, user])
            );
            return Array.from(uniqueMap.values());
          });
        }

        if (response.data.currentPage === response.data.totalPages) {
          page.current = 0;
        } else {
          page.current++;
        }
      }
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Error fetching students",
      });
    } finally {
      loadingVisible && setLoading(false);
      !loadingVisible && setFetching(false);
    }
  };

  const handleFilterChanges = (newFilter: "all" | "male" | "female") => {
    setFilter(newFilter);
    setStudents([]);
    filterRef.current = newFilter;
    page.current = 1;
    fetchStudents(true);
    bottomSheetRef.current?.close();
  };

  const renderItem = ({ item }: { item: IUser }) => {
    return <UserCard user={item} />;
  };

  return (
    <SafeAreaView className="flex flex-1">
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
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
            {trimText("Lead University")}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-center h-[40px] w-[65px] rounded-md bg-white dark:bg-charcoal-950 border border-grey-100"
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}
          >
            <Text className="text-grey-500 mr-1">Filter</Text>
            <FilterSvg color={isDark ? "#fff" : "#6B7280"} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {loading ? (
        <StudentsListSkeleton />
      ) : (
        <AnimatedList
          ListHeaderComponent={
            <View style={{ paddingTop: HEADER_HEIGHT - insets.top }}>
              <SearchBar
                placeholder="Search for people here"
                onTouchStart={() =>
                  router.push({
                    pathname: "/university/search",
                    params: { id: universityId },
                  })
                }
                showSoftInputOnFocus={false}
              />
            </View>
          }
          data={students as IUser[]}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          estimatedItemSize={150}
          onEndReached={() => {
            fetchStudents(false);
          }}
          onEndReachedThreshold={0.4}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 18 }}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: isDark ? colors.charcoal[950] : colors.white,
        }}
        onAnimate={(fromIndex, toIndex) => {
          setBottomSheetOpen(toIndex !== -1);
        }}
      >
        <View className="flex-1 px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-sans-semibold text-lg">Filter Students</Text>
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.close()}
              className="p-2"
            >
              <Text className="text-red-500 dark:text-red-500">Close</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="py-4 border-b border-grey-100 dark:border-grey-800"
            onPress={() => {
              handleFilterChanges("all");
            }}
          >
            <Text
              className={
                filter === "all" ? "text-primary-500 dark:text-primary-500" : ""
              }
            >
              All Students
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 border-b border-grey-100 dark:border-grey-800"
            onPress={() => {
              handleFilterChanges("male");
            }}
          >
            <Text
              className={
                filter === "male"
                  ? "text-primary-500 dark:text-primary-500"
                  : ""
              }
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 border-b border-grey-100 dark:border-grey-800"
            onPress={() => {
              handleFilterChanges("female");
            }}
          >
            <Text
              className={
                filter === "female"
                  ? "text-primary-500 dark:text-primary-500"
                  : ""
              }
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
