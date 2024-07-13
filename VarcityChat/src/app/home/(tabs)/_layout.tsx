import { Tabs } from "expo-router";

export const unstable_settings = {
  initialRouteName: "discover",
};

const TabNavigation = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="news" />
      <Tabs.Screen name="calls" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabNavigation;
