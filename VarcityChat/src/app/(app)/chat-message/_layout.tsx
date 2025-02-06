import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, View, Text, TouchableOpacity, IS_IOS } from "@/ui";
import ThreeDotsSvg from "@/ui/icons/three-dots";
import CallsActive from "@/ui/icons/calls-active";
import BackButton from "@/components/back-button";
import { useActiveChat } from "@/core/hooks/use-chats";
import { defaultAvatarUrl } from "../../../../constants/chats";

export default function ChatMessageLayout() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { activeChatUser } = useActiveChat(id as string);

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "",
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: () => {
            return (
              <BackButton
                onPress={() => {
                  router.canGoBack() && router.back();
                }}
              />
            );
          },
          headerRight: () => {
            return (
              <View
                style={{ flexDirection: "row", gap: 30, alignItems: "center" }}
              >
                <TouchableOpacity activeOpacity={0.3}>
                  <CallsActive />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.3} className="w-[15px]">
                  <ThreeDotsSvg />
                </TouchableOpacity>
              </View>
            );
          },
          headerTitle: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingBottom: 4,
                  alignItems: "center",
                  width: 220,
                  marginLeft: IS_IOS ? 0 : 15,
                }}
              >
                <Image
                  source={{
                    uri: activeChatUser?.images[0] || defaultAvatarUrl,
                  }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                />
                <View>
                  <Text className="font-sans-semibold">
                    {activeChatUser?.firstname} {activeChatUser?.lastname}
                  </Text>
                  <Text className="text-sm text-grey-500 font-sans-regular">
                    Active 5 mins ago
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
    </Stack>
  );
}
