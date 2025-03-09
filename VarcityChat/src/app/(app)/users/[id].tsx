import BackButton from "@/components/back-button";
import { View, Text, WIDTH } from "@/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CallsActive from "@/ui/icons/calls-active";
import ChatUserSvg from "@/ui/icons/user/chat-user-svg";
import { HEADER_HEIGHT } from "@/components/header";
import React, { useEffect } from "react";
import { IUser } from "@/types/user";
import { capitalize, trimText } from "@/core/utils";
import { IUniversity } from "@/api/universities/types";
import { useChats } from "@/core/hooks/use-chats";
import { useApi } from "@/core/hooks/use-api";
import { useInitializeConversationMutation } from "@/api/chats/chat-api";
import { useAppDispatch } from "@/core/store/store";
import { setActiveChat } from "@/core/chats/chats-slice";
import { useAuth } from "@/core/hooks/use-auth";
import { IChat } from "@/api/chats/types";

const IMG_HEIGHT = 300;

const hobbies = ["football", "baseball", "cooking", "movies"];

export default function User() {
  const dispatch = useAppDispatch();
  const { user } = useLocalSearchParams();
  const { user: authUser } = useAuth();
  const userData = JSON.parse(user as string) as IUser;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const { chats, loadChats } = useChats();
  const { callMutationWithErrorHandler } = useApi();
  const [initializeConversation, { isLoading: isInitializingChat }] =
    useInitializeConversationMutation();

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

  // Refresh the chats when the user is on this page
  useEffect(() => {
    loadChats();
  }, []);

  const handleOpenChat = async () => {
    if (chats?.length) {
      const chatIndex = chats.findIndex(
        (chat) =>
          chat.user1._id === userData._id || chat.user2._id === userData._id
      );
      if (chatIndex > -1) {
        const chat = chats[chatIndex];
        const chatReceiver =
          chat.user1._id === authUser?._id ? chat.user2 : chat.user1;
        dispatch(setActiveChat({ chat, receiver: chatReceiver }));
        router.push(`/(app)/chat-message/${chat._id}`);
        return;
      }
    }

    // create conversation request
    const { data, isError } = await callMutationWithErrorHandler(() =>
      initializeConversation(userData._id).unwrap()
    );

    if (!isError && data && "conversation" in data) {
      if (
        data.conversation &&
        typeof data.conversation === "object" &&
        "_id" in data.conversation
      ) {
        console.log("\nCONVERSATION:", data.conversation);
        dispatch(
          setActiveChat({
            chat: data.conversation as IChat,
            receiver:
              (data.conversation as IChat).user1._id === authUser?._id
                ? (data.conversation as IChat).user2
                : (data.conversation as IChat).user1,
          })
        );
      }
      setTimeout(() => {
        router.push(`/(app)/chat-message/${(data.conversation as IChat)._id}`);
      }, 200);
    }
  };

  if (!userData) return null;

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
                className="font-sans-semibold text-lg dark:text-white"
                style={[headerTextAnimatedStyle]}
              >
                {userData.firstname} {userData.lastname}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
          {/* Content Goes Here */}

          <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <View className="relative flex flex-row">
              <FlatList
                data={[...userData.images]}
                horizontal
                keyExtractor={(item, index) => `img-${index}`}
                renderItem={({ item }) => (
                  <Animated.Image
                    source={{ uri: item }}
                    style={[
                      { width: WIDTH, height: IMG_HEIGHT, objectFit: "cover" },
                    ]}
                  />
                )}
                style={{ minHeight: IMG_HEIGHT }}
                ListEmptyComponent={
                  <View className="w-screen items-center justify-center bg-gray-200 dark:bg-gray-400">
                    <Text>No Images Yet</Text>
                  </View>
                }
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
                  <Animated.Text className="font-sans-bold text-2xl text-black dark:text-white">
                    {trimText(`${userData.firstname} ${userData.lastname}`)}
                  </Animated.Text>
                  <Text className="text-grey-500 dark:text-grey-200">
                    {capitalize((userData.university as IUniversity).name)}
                  </Text>
                  <Text className="text-grey-500 dark:text-grey-200">
                    {userData.course}
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
                    disabled={isInitializingChat}
                    activeOpacity={0.7}
                    className="w-[45px] h-[45px] rounded-lg bg-primary-600 items-center justify-center border border-primary-600"
                    onPress={() => {
                      handleOpenChat();
                    }}
                  >
                    {isInitializingChat ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <ChatUserSvg />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <Seperator />

              <Text className="font-sans-bold text-lg">About Me</Text>
              <Text className="text-grey-500 dark:text-grey-200">
                {userData?.about || "No information yet"}
              </Text>

              <Seperator />

              {userData?.hobbies && userData?.hobbies?.length && (
                <View>
                  <Text className="font-sans-bold text-lg">Hobbies</Text>
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
              )}
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
