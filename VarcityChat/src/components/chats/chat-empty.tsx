import { memo } from "react";
import { View, Image, Text } from "@/ui";
import { emptyChatImg } from "@/ui/images";

const ChatEmptyComponent = memo(() => {
  return (
    <View
      className="flex flex-1 items-center justify-center"
      style={{ transform: [{ rotateX: "180deg" }] }}
    >
      <Image source={emptyChatImg} className="w-[50px] h-[50px]" />
      <Text className="mt-4 font-sans-medium">Start a Conversation</Text>
    </View>
  );
});

export default ChatEmptyComponent;
