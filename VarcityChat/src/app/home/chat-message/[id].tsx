import { StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { messages as messagesData } from "../../../../constants/message";
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

export default function ChatMessage() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");

  const swipeableRef = useRef<Swipeable | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    setMessages([
      ...messagesData.map((message) => {
        return {
          _id: message._id,
          text: message.text,
          createdAt: new Date(),
          user: {
            _id: message.from,
            name: message.from ? "You" : "Bob",
          },
        };
      }),
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

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

  return (
    <View className="flex flex-1" style={{ marginBottom: insets.bottom }}>
      <GiftedChat
        messages={messages}
        onSend={(messages: any) => onSend(messages)}
        user={{ _id: 1 }}
        onInputTextChanged={setText}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{
              right: { color: "#000", fontSize: 15 },
              left: { fontSize: 15 },
            }}
            wrapperStyle={{
              left: { backgroundColor: colors.grey[50] },
              right: { backgroundColor: colors.primary[50] },
            }}
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
          <InputToolbar
            {...props}
            containerStyle={{}}
            renderActions={() => (
              <TouchableOpacity className="h-[44px] justify-center items-center left-3">
                <EmojiSelectSvg />
              </TouchableOpacity>
            )}
          />
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
      <Text className="mt-4">Start a Conversation</Text>
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
