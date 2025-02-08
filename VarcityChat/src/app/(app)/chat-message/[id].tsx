import { StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { TouchableOpacity, View, Text, Image, colors } from "@/ui";
import { emptyChatImg } from "@/ui/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MicrophoneSvg from "@/ui/icons/chat/microphone-svg";
import AttachmentSvg from "@/ui/icons/chat/attachment-svg";
import PictureSvg from "@/ui/icons/chat/picture-svg";
import SendSvg from "@/ui/icons/chat/send-svg";
import EmojiSelectSvg from "@/ui/icons/chat/emoji-select-svg";
import ChatMessageBox from "@/components/chats/chat-message-box";
import ReplyMessageBar from "@/components/chats/reply-message-bar";
import { Swipeable } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useActiveChat } from "@/core/hooks/use-chats";
import { MessageRequest } from "@/components/chats/message-request";
import { useChatMessages } from "@/core/hooks/use-chat-messages";
import { ExtendedMessage } from "@/api/chats/types";
import { useAuth } from "@/core/hooks/use-auth";
import { useRealm } from "@realm/react";
import { convertToGiftedChatMessage } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";

const MESSAGES_PER_PAGE = 50;
const MESSAGE_ARCHIVE_THRESHOLD = 1000; // Archive messages beyound this count
const MESSAGE_CLEANUP_DAYS = 10;

export default function ChatMessage() {
  const { id: conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { chat, activeChatUser, isPending } = useActiveChat(
    conversationId as string
  );
  const { sendMessage } = useChatMessages();
  const realm = useRealm();

  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const currentPage = useRef(1);

  const swipeableRef = useRef<Swipeable | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    const messages = realm
      .objects<ExtendedMessage>("Message")
      .filtered(`conversationId == $0`, conversationId)
      .sorted("createdAt", true);

    console.log("MESSAGES FROM REALM:", messages);

    messages.addListener((messages) => {
      console.log("NEW MESSAGES FROM LISTENER:", messages);
      setMessages(
        messages.map((message) =>
          convertToGiftedChatMessage(message as unknown as ExtendedMessage)
        )
      );
    });

    setMessages(
      messages.map((message) =>
        convertToGiftedChatMessage(message as unknown as ExtendedMessage)
      )
    );

    return () => {
      messages.removeAllListeners();
    };
  }, [realm, conversationId]);

  const onSend = useCallback(
    (messages: IMessage[]) => {
      const [message] = messages;
      sendMessage(
        {
          conversationId: conversationId as string,
          content: message.text,
          sender: user!._id,
          receiver: activeChatUser!._id,
        } as unknown as ExtendedMessage,
        conversationId as string
      );
      console.log("MESSAGE TO SEND", messages);
    },
    [conversationId, user, activeChatUser, sendMessage]
  );

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage === replyMessage._id
      ) {
        swipeableRef.current = ref;
      }
    },
    [replyMessage]
  );

  useEffect(() => {
    if (replyMessage && swipeableRef.current) {
      swipeableRef.current.close();
      swipeableRef.current = null;
    }
  }, [replyMessage]);

  const renderTicks = (message: ExtendedMessage) => {
    if (message.user._id !== user!._id) return null;
    if (message.received) {
      // Double tick (✓✓) - Message Delivered
      return (
        <View style={{ flexDirection: "row", marginRight: 4 }}>
          <Ionicons name="checkmark-done" size={12} color="green" />
        </View>
      );
    } else if (message.sent) {
      // Single tick (✓) - Message Sent
      return (
        <Ionicons
          name="checkmark"
          size={12}
          color="gray"
          style={{ marginRight: 4 }}
        />
      );
    }
    return null;
  };
  return (
    <View className="flex flex-1" style={{ marginBottom: insets.bottom }}>
      {isPending ? (
        <MessageRequest chat={chat!} />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(messages: any) => onSend(messages)}
          user={{ _id: user!._id }}
          onInputTextChanged={setText}
          bottomOffset={insets.bottom}
          renderAvatar={null}
          maxComposerHeight={100}
          renderBubble={(props) => (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: "#000",
                  fontSize: 14,
                  fontFamily: "PlusJakartaSans_400Regular",
                },
                left: { fontSize: 15 },
              }}
              wrapperStyle={{
                left: { backgroundColor: colors.grey[50] },
                right: { backgroundColor: colors.primary[50] },
              }}
              renderTicks={renderTicks}
            />
          )}
          renderSend={(props) => (
            <View
              style={{
                flexDirection: "row",
                height: 44,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                paddingHorizontal: 14,
              }}
            >
              {text.length > 0 && (
                <Send {...props} containerStyle={{ justifyContent: "center" }}>
                  <SendSvg />
                </Send>
              )}
              {text.length === 0 && (
                <>
                  <TouchableOpacity>
                    <MicrophoneSvg />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <AttachmentSvg />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <PictureSvg />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          textInputProps={styles.composer}
          renderInputToolbar={(props) => (
            <InputToolbar {...props} containerStyle={{ height: 60 }} />
          )}
          renderMessage={(props) => (
            <ChatMessageBox
              {...props}
              setReplyOnSwipe={setReplyMessage}
              updateRowRef={updateRowRef}
            />
          )}
          renderChatFooter={() => (
            <ReplyMessageBar
              clearReply={() => setReplyMessage(null)}
              message={replyMessage}
            />
          )}
          renderChatEmpty={() => <ChatEmptyComponent />}
        />
      )}
    </View>
  );
}

function ChatEmptyComponent() {
  return (
    <View
      className="flex flex-1 items-center justify-center"
      style={{ transform: [{ rotateX: "180deg" }] }}
    >
      <Image source={emptyChatImg} className="w-[50px] h-[50px]" />
      <Text className="mt-4 font-sans-medium">Start a Conversation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 15,
    paddingTop: 8,
  },
});
