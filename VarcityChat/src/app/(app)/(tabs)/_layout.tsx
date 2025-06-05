import { Tabs } from "expo-router";
import { Image, View, colors } from "@/ui";
import { femaleImg, maleImg } from "@/ui/images";
import { useColorScheme } from "nativewind";
import ChatsActive from "@/ui/icons/chats-active";
import Discover from "@/ui/icons/discover";
import DiscoverActive from "@/ui/icons/discover-active";
import ChatsSvg from "@/ui/icons/chats";
import NewsActive from "@/ui/icons/news-active";
import NewsSvg from "@/ui/icons/news";
import CallsActive from "@/ui/icons/calls-active";
import CallsSvg from "@/ui/icons/calls";
import { Platform } from "react-native";
import { useAuth } from "@/core/hooks/use-auth";
import { Gender } from "@/types/user";
import { useChats } from "@/core/hooks/use-chats";

const TabNavigation = () => {
  const { colorScheme } = useColorScheme();
  const { user } = useAuth();
  const { totalUnreadCount } = useChats();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      backBehavior="order"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: "PlusJakartaSans_400Regular",
          marginBottom: Platform.OS === "android" ? 12 : 0,
        },
        tabBarStyle: {
          paddingTop: 6,
          backgroundColor: isDark ? colors.black : colors.white,
          height: Platform.OS === "android" ? 65 : 80,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) =>
            focused ? <DiscoverActive /> : <Discover />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ focused }) =>
            focused ? <ChatsActive /> : <ChatsSvg />,
          tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
          tabBarBadgeStyle: {
            fontSize: 10,
            minWidth: 18,
            maxWidth: 26,
            height: 18,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 2,
          },
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ focused }) => (focused ? <NewsActive /> : <NewsSvg />),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          tabBarIcon: ({ focused }) =>
            focused ? <CallsActive /> : <CallsSvg />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => {
            return (
              <View className="w-[28px] h-[28px] rounded-full overflow-hidden">
                <Image
                  source={user?.gender === Gender.MALE ? maleImg : femaleImg}
                  className="object-cover w-full h-full rounded-full"
                />
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabNavigation;
