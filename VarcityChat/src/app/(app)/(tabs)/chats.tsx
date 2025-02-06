import { useEffect } from "react";
import SearchBar from "@/components/search-bar";
import { Image, View, Text, TouchableOpacity } from "@/ui";
import { useRouter } from "expo-router";
import { Platform, SafeAreaView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  FadeIn,
  LinearTransition,
} from "react-native-reanimated";
import { HEADER_HEIGHT } from "@/components/header";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChats } from "@/core/hooks/use-chats";
import { useAuth } from "@/core/hooks/use-auth";
import { useToast } from "@/core/hooks/use-toast";
import { defaultAvatarUrl } from "../../../../constants/chats";
import { useSocket } from "@/context/SocketContext";
import { ExtendedMessage } from "@/api/chats/types";
import ChatsSkeleton from "@/components/chats/chats-skeleton";

export default function Chats() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { socket } = useSocket();
  const { chats, isLoading, error, updateChatOrder } = useChats();
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    socket?.on("new-message", (message: ExtendedMessage) => {
      console.log("NEW MESSAGE:", message);
      updateChatOrder(message);
    });
    return () => {
      socket?.off("new-message", updateChatOrder);
    };
  }, []);

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

  if (error) {
    showToast({ type: "error", text1: "Error", text2: `${error}` });
  }

  return (
    <SafeAreaView className="flex flex-1">
      <Animated.View
        className="items-center mt-4"
        style={[
          Platform.OS === "android" && {
            paddingTop: insets.top,
            height: HEADER_HEIGHT,
          },
        ]}
      >
        <Animated.Text className="font-sans-bold text-lg dark:text-white">
          Chats
        </Animated.Text>

        <Animated.View
          className="h-[1px] w-full bg-grey-50 mt-4 dark:bg-grey-800"
          style={animatedStyle}
        />
      </Animated.View>

      {isLoading ? (
        <ChatsSkeleton />
      ) : (
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
          keyExtractor={(item) => `${item._id}`}
          contentContainerStyle={{ paddingHorizontal: 6 }}
          data={chats}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-grey-50 mt-3 mb-5 dark:bg-grey-800" />
          )}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeIn.delay(index * 150)}
              layout={LinearTransition.springify().mass(0.15).damping(20)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                className="w-full flex-row items-center bg-red"
                onPress={() => router.push("/chat-message/1")}
              >
                <View className="w-[40px] h-[40px] overflow-hidden rounded-full mr-4">
                  <Image
                    className="object-cover w-full h-full"
                    source={{
                      uri:
                        item.user1._id === user?._id
                          ? item.user2.images[0] || defaultAvatarUrl
                          : item.user1.images[0] || defaultAvatarUrl,
                    }}
                  />
                </View>

                <View className="justify-between flex-1">
                  <Text className="font-sans-semibold text-base">
                    {item.user1._id === user?._id
                      ? item.user2.firstname
                      : item.user1.firstname}
                  </Text>
                  <Text className="text-grey-400 text-sm mt-1 dark:text-grey-400 font-sans-medium">
                    {item.lastMessage ||
                      (item.status !== "accepted" && "Pending request")}
                  </Text>
                </View>

                <View className="flex items-end justify-end">
                  <Text className="text-sm text-grey-300 mb-2 dark:text-grey-400 font-sans-regular">
                    {/* {item?.lastMessageTimestamp?.toString()} */}2 minutes
                    ago
                  </Text>

                  {item.user1._id == user?._id && item.unreadCountUser2 > 0 ? (
                    <View className="w-[20px] h-[20px] rounded-full bg-primary-500 flex items-center justify-center">
                      <Text className="text-white dark:text-white font-sans-thin text-sm">
                        {item.unreadCountUser2}
                      </Text>
                    </View>
                  ) : null}

                  {item.user2._id === user?._id && item.unreadCountUser1 > 0 ? (
                    <View className="w-[20px] h-[20px] rounded-full bg-primary-500 flex items-center justify-center">
                      <Text className="text-white dark:text-white font-sans-thin text-sm">
                        {item.unreadCountUser1}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListFooterComponent={<View className="h-16" />}
        />
      )}
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
          className={`text-sm font-sans ${
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
          className={`text-sm  font-sans ${
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
