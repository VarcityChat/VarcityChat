import BackButton from "@/components/back-button";
import { View, Text, WIDTH } from "@/ui";
import { userImg } from "@/ui/images";
import { useRouter } from "expo-router";
import { TouchableOpacity, FlatList } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import CallsActive from "@/ui/icons/calls-active";
import ChatUserSvg from "@/ui/icons/user/chat-user-svg";
import { HEADER_HEIGHT } from "@/components/header";

const IMG_HEIGHT = 300;

const hobbies = ["football", "baseball", "cooking", "movies"];

export default function User() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, IMG_HEIGHT / 2, IMG_HEIGHT],
        [0, 0, 1]
      ),
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, IMG_HEIGHT / 2], [0, 1]),
      borderBottomWidth: withTiming(scrollY.value > 0 ? 0.5 : 0, {
        duration: 300,
      }),
      elevation: withTiming(scrollY.value > 0 ? 4 : 0, { duration: 300 }),
    };
  });

  return (
    <>
      {/* HEADER */}
      <View className="flex flex-1">
        <Animated.View
          className="absolute top-0 left-0 right-0 bg-white z-10 border-b-grey-100 dark:bg-charcoal-950 dark:border-b-charcoal-800 opacity-0"
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
              <Animated.Text
                className="font-semibold text-lg dark:text-white"
                style={[headerTextAnimatedStyle]}
              >
                Ebuka Varcity
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
          {/* Content Goes Here */}

          <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <View className="relative flex flex-row bg-red-400">
              <FlatList
                data={[userImg, userImg, userImg]}
                horizontal
                keyExtractor={(item, index) => `img-${index}`}
                renderItem={({ item }) => (
                  <Animated.Image
                    source={item}
                    style={[
                      { width: WIDTH, height: IMG_HEIGHT, objectFit: "cover" },
                    ]}
                  />
                )}
                pagingEnabled
                bounces={false}
              />

              <View
                style={{
                  position: "absolute",
                  left: 16,
                  top: insets.top + 10,
                  zIndex: 99,
                }}
              >
                <BackButton
                  className="absolute z-50"
                  onPress={() => {
                    router.canGoBack() && router.back();
                  }}
                />
              </View>
            </View>

            <View className="min-h-screen px-6 py-8">
              <View className="flex-row">
                <View className="flex-1">
                  <Animated.Text className="font-bold text-2xl text-black dark:text-white">
                    Ebuka Varcity
                  </Animated.Text>
                  <Text className="text-grey-500 dark:text-grey-200">
                    Lead City University
                  </Text>
                  <Text className="text-grey-500 dark:text-grey-200">
                    Computer Science
                  </Text>
                  <Text className="text-grey-500 dark:text-grey-200">
                    100 Level
                  </Text>
                </View>

                <View className="flex flex-row gap-4">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-[45px] h-[45px] rounded-lg bg-primary-100 items-center justify-center border border-primary-500"
                    onPress={() => alert("Call not available at the moment")}
                  >
                    <CallsActive />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-[45px] h-[45px] rounded-lg bg-primary-600 items-center justify-center border border-primary-600"
                    onPress={() => router.push("/home/chat-message/1")}
                  >
                    <ChatUserSvg />
                  </TouchableOpacity>
                </View>
              </View>

              <Seperator />

              <Text className="font-bold text-lg">About Me</Text>
              <Text className="text-grey-500 dark:text-grey-200">
                Lorem ipsum dolor sit amet consectetur. Integer arcu amet tempor
                porttitor sapien varius. Dolor porttitor ut cursus ut vel
                facilisis arcu tortor quam. Pellentesque urna non egestas nam
                elementum feugiat risus urna bibendum. Integer accumsan non
                porttitor elit. Aliquam velit nullam consectetur sed et. Mauris
                nunc massa dui ac pretium. Dictum vel leo turpis massa facilisis
                fusce. Ultricies sit massa eget id. Maecenas nulla aliquam
                pulvinar auctor. Faucibus bibendum in enim feugiat. Et ac
                feugiat lectus.
              </Text>

              <Seperator />

              <Text className="font-bold text-lg">Hobbies</Text>
              <View className="flex-row gap-3 mt-4">
                {hobbies.map((hobby, index) => (
                  <View
                    className="p-3 rounded-full bg-primary-200 border border-primary-600"
                    key={`hobby-${index}`}
                  >
                    <Text className="text-primary-600 dark:text-primary-600">
                      {hobby}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.ScrollView>
        </Animated.ScrollView>
      </View>
    </>
  );
}

const Seperator = () => (
  <View className="h-[1px] w-full bg-grey-50 dark:bg-grey-700 mt-4 mb-6" />
);
