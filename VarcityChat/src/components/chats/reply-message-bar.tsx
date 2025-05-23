import { ExtendedMessage } from "@/api/chats/types";
import { useAppSelector } from "@/core/store/store";
import { formatChatReplyMessage, trimText } from "@/core/utils";
import { View, Text, TouchableOpacity, colors } from "@/ui";
import { Ionicons } from "@expo/vector-icons";
import { IMessage } from "react-native-gifted-chat";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: IMessage | null;
};

const ReplyMessageBar = ({ clearReply, message }: ReplyMessageBarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const activeChat = useAppSelector((state) => state.chats.activeChat);

  return (
    <>
      {message !== null && (
        <Animated.View
          style={{
            height: 50,
            flexDirection: "row",
            backgroundColor: "#edf2f3",
          }}
          entering={FadeInDown}
          exiting={FadeOutDown}
        >
          <View
            style={{
              height: 50,
              width: 6,
              backgroundColor: colors.primary[300],
            }}
          />
          <View
            style={{
              flexDirection: "column",
              paddingBottom: 5,
              width: "90%",
            }}
          >
            <Text
              style={{
                color: colors.primary[500],
                paddingLeft: 10,
                paddingTop: 2,
                fontWeight: "800",
                fontSize: 13,
              }}
            >
              {message?.user?._id === user?._id
                ? "You"
                : trimText(`${activeChat?.receiver?.firstname}`, 20)}
            </Text>
            <Text
              style={{
                color: colors.grey[500],
                paddingLeft: 10,
                paddingRight: 2,
              }}
              numberOfLines={1}
            >
              {formatChatReplyMessage(message as IMessage & ExtendedMessage)}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: 10,
            }}
          >
            <TouchableOpacity onPress={clearReply}>
              <Ionicons
                name="close-circle-outline"
                color={colors.primary[500]}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default ReplyMessageBar;
