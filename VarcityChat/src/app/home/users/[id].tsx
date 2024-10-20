import BackButton from "@/components/back-button";
import { View, Text, WIDTH } from "@/ui";
import { userImg } from "@/ui/images";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import ChatsSvg from "@/ui/icons/chats";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IMG_HEIGHT = 300;

const hobbies = ["football", "baseball", "cooking", "movies"];

export default function User() {
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

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 2], [0, 1]),
    };
  });

  const headerTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, IMG_HEIGHT / 2, IMG_HEIGHT + 40],
        [0, 0, 1]
      ),
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: () => (
            <Animated.Text
              className={"font-semibold text-lg"}
              style={[headerTextAnimatedStyle]}
            >
              Ebuka Varcity
            </Animated.Text>
          ),
          headerBackground: () => (
            <Animated.View
              style={[
                { height: 100, backgroundColor: "#fff" },
                headerAnimatedStyle,
              ]}
            ></Animated.View>
          ),
        }}
      />

      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <View className="relative">
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

          {/* <Animated.Image
            source={userImg}
            style={[
              {
                width: WIDTH,
                height: IMG_HEIGHT,
                objectFit: "cover",
              },
              imageAnimatedStyle,
            ]}
          /> */}

          <View
            className="absolute left-6 z-50"
            style={{ top: insets.top + 10 }}
          >
            <BackButton
              onPress={() => {
                router.back();
              }}
            />
          </View>
        </View>

        <View className="min-h-screen px-6 py-8 bg-white">
          <View className="flex-row">
            <View className="flex-1">
              <Animated.Text className="font-bold text-2xl">
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

            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                className="w-[40px] h-[40px] rounded-lg bg-primary-600 items-center justify-center"
              >
                <ChatsSvg fill={"white"} />
              </TouchableOpacity>
            </View>
          </View>

          <Seperator />

          <Text className="font-bold text-lg">About Me</Text>
          <Text className="text-grey-500 dark:text-grey-200">
            Lorem ipsum dolor sit amet consectetur. Integer arcu amet tempor
            porttitor sapien varius. Dolor porttitor ut cursus ut vel facilisis
            arcu tortor quam. Pellentesque urna non egestas nam elementum
            feugiat risus urna bibendum. Integer accumsan non porttitor elit.
            Aliquam velit nullam consectetur sed et. Mauris nunc massa dui ac
            pretium. Dictum vel leo turpis massa facilisis fusce. Ultricies sit
            massa eget id. Maecenas nulla aliquam pulvinar auctor. Faucibus
            bibendum in enim feugiat. Et ac feugiat lectus.
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
    </>
  );
}

const Seperator = () => (
  <View className="h-[1px] w-full bg-grey-50 mt-4 mb-6" />
);
