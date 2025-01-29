import SearchBar from "@/components/search-bar";
import { Image, View, Text, TouchableOpacity } from "@/ui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { chats } from "../../../../constants/chats";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import React, { useState } from "react";

export default function Chats() {
  const router = useRouter();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const opacityStyle = interpolate(scrollY.value, [0, 100], [0, 1]);
    return {
      opacity: opacityStyle,
    };
  });

  return (
    <SafeAreaView className="flex flex-1">
      <Animated.View className="items-center mt-4">
        <Animated.Text className="font-inter font-semibold text-lg dark:text-white">
          Chats
        </Animated.Text>

        <Animated.View
          className="h-[1px] w-full bg-grey-50 mt-4 dark:bg-grey-800"
          style={animatedStyle}
        />
      </Animated.View>

      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <>
            <SearchBar placeholder="Search" />
            <ChatFilter />
          </>
        }
        contentContainerClassName="px-6"
        style={{ flex: 1 }}
        keyExtractor={(_, index) => `item-${index}`}
        contentContainerStyle={{ paddingHorizontal: 6 }}
        data={chats}
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-grey-50 mt-3 mb-5 dark:bg-grey-800" />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-full flex-row items-center bg-red"
            onPress={() => router.push("/home/chat-message/1")}
          >
            <View className="w-[40px] h-[40px] overflow-hidden rounded-full mr-4">
              <Image
                className="object-cover w-full h-full"
                source={item.image}
              />
            </View>

            <View className="justify-between flex-1">
              <Text className="font-semibold text-lg">{item.name}</Text>
              <Text className="text-grey-400 text-sm mt-1 dark:text-grey-400">
                {item.lastMessage}
              </Text>
            </View>

            <View className="flex items-end justify-end">
              <Text className="text-sm text-grey-300 mb-2 dark:text-grey-400">
                {item.timestamp}
              </Text>
              <View className="w-[20px] h-[20px] rounded-full bg-primary-500 flex items-center justify-center">
                <Text className="text-white dark:text-white">1</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={<View className="h-16" />}
      />
    </SafeAreaView>
  );
}

function ChatFilter() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  return (
    <View className="flex flex-row mb-6 gap-4">
      <TouchableOpacity
        onPress={() => setFilter("all")}
        activeOpacity={0.7}
        className={`px-3 py-2 ${
          filter === "all" ? "bg-primary-50" : "bg-grey-50 dark:bg-grey-800"
        } rounded-full`}
      >
        <Text
          className={`text-sm  ${
            filter === "all"
              ? " text-primary-500 dark:text-primary-500"
              : "text-grey-500 dark:text-grey-200"
          }`}
        >
          All Chats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setFilter("unread")}
        activeOpacity={0.7}
        className={`px-3 py-2 ${
          filter === "unread" ? "bg-primary-50" : "bg-grey-50 dark:bg-grey-800"
        } rounded-full`}
      >
        <Text
          className={`text-sm  ${
            filter === "unread"
              ? " text-primary-500 dark:text-primary-500"
              : "text-grey-500 dark:text-grey-200"
          }`}
        >
          Unread
        </Text>
      </TouchableOpacity>
    </View>
  );
}
