import { memo } from "react";
import { View, Image, Text } from "@/ui";
import { emptyChatImg } from "@/ui/images";
import { Platform } from "react-native";

const ChatEmptyComponent = memo(() => {
  const style = Platform.select({
    ios: { transform: [{ rotateX: "180deg" }] },
    android: { transform: [{ rotateX: "-180deg" }, { rotateY: "-180deg" }] },
  });

  return (
    <View className="flex flex-1 items-center justify-center" style={style}>
      <Image source={emptyChatImg} className="w-[50px] h-[50px]" />
      <Text className="mt-4 font-sans-medium">Start a Conversation</Text>
    </View>
  );
});

export default ChatEmptyComponent;
