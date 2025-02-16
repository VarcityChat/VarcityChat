import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { useQuery, useRealm } from "@realm/react";
import { convertToGiftedChatMessage } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { MessageSchema } from "@/core/models/message-model";

const MemoizedGiftedChat = memo(GiftedChat);
let renderedCount = 0;
const MESSAGES_PER_PAGE = 25;

export default function ChatMessage() {
  const insets = useSafeAreaInsets();
  const { id: conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const realm = useRealm();
  const { chat, activeChatUser, isPending } = useActiveChat(
    conversationId as string
  );
  const [page, setPage] = useState(1);
  // const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");

  const { sendMessage } = useChatMessages();

  const messagesFromRealm = useQuery(MessageSchema)
    .filtered(`conversationId == $0`, conversationId)
    .sorted("createdAt", true)
    .slice(0, page * MESSAGES_PER_PAGE);

  console.log("CURRENT PAGE:", page);

  // .slice((page - 1) * MESSAGES_PER_PAGE, page * MESSAGES_PER_PAGE);

  const swipeableRef = useRef<Swipeable | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  console.log("RENDERED COUNT:", renderedCount++);

  // GENERATE 10,000 MESSAGES
  // useEffect(() => {
  //   let msgs = [];
  //   for (let i = 0; i < 10000; i++) {
  //     msgs.push({
  //       _id: i.toString(),
  //       text: "Hello developer",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: "React Native",
  //       },
  //     });
  //   }
  //   console.log("MESSAGES:", msgs.length);
  //   setMessages(msgs);
  // }, []);

  // useEffect(() => {
  //   const messages = realm
  //     .objects<ExtendedMessage>("Message")
  //     .filtered(`conversationId == $0`, conversationId)
  //     .sorted("createdAt", true)
  //     .slice(0, 30);

  //   console.log("MESSAGES FROM REALM:", messages);

  //   // messages.addListener((messages) => {
  //   //   console.log("NEW MESSAGES FROM LISTENER:", messages);
  //   //   setMessages(
  //   //     messages.map((message) =>
  //   //       convertToGiftedChatMessage(message as unknown as ExtendedMessage)
  //   //     )
  //   //   );
  //   // });

  //   setMessages(
  //     messages.map((message) =>
  //       convertToGiftedChatMessage(message as unknown as ExtendedMessage)
  //     )
  //   );

  //   return () => {
  //     // messages.removeAllListeners();
  //   };
  // }, [realm, conversationId]);

  const onSend = useCallback(
    (messages: IMessage[]) => {
      console.log("CLICKED BUTTON");
      console.log(messages);
      const message = messages[0];
      sendMessage(
        {
          conversationId: conversationId as string,
          content: message.text,
          sender: user!._id,
          receiver: activeChatUser!._id,
        } as unknown as ExtendedMessage,
        conversationId as string
      );

      // setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
    },
    [conversationId]
  );

  const loadEarlier = useCallback(() => {
    console.log("FETCHING EARLIER MESSAGES:");
    setPage((prev) => prev + 1);
  }, [page]);

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
    <View
      className="flex flex-1"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      {isPending && chat?.user1._id !== user?._id ? (
        <MessageRequest chat={chat!} />
      ) : (
        <>
          <GiftedChat
            messages={messagesFromRealm.map((message) =>
              convertToGiftedChatMessage(message as unknown as ExtendedMessage)
            )}
            listViewProps={{
              windowSize: 7,
              initialNumToRender: 25,
              maxToRenderPerBatch: 50,
              updateCellsBatchingPeriod: 50,
              removeCliippedSubviews: true,
            }}
            onSend={(messages: any) => onSend(messages)}
            user={{ _id: user!._id }}
            renderBubble={(props) => <CustomMessageBubble {...props} />}
            onInputTextChanged={setText}
            // bottomOffset={insets.bottom}
            renderAvatar={null}
            maxComposerHeight={100}
            timeTextStyle={{ right: { color: "green" } }}
            renderSend={(props) => (
              <View className="flex flex-row items-center justify-center gap-2 h-[44px] px-4">
                {text.length > 0 && (
                  <Send
                    {...props}
                    containerStyle={{ justifyContent: "center" }}
                  >
                    <SendSvg width={30} height={30} />
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
            scrollToBottom={true}
            infiniteScroll
            loadEarlier
            onLoadEarlier={loadEarlier}
            // renderLoadingEarlier=
            // renderInputToolbar={(props) => (
            //   <InputToolbar {...props} containerStyle={{ height: 60 }} />
            // )}
            // renderMessage={(props) => (
            //   <ChatMessageBox
            //     {...props}
            //     setReplyOnSwipe={setReplyMessage}
            //     updateRowRef={updateRowRef}
            //   />
            // )}
            // renderChatFooter={() => (
            //   <ReplyMessageBar
            //     clearReply={() => setReplyMessage(null)}
            //     message={replyMessage}
            //   />
            // )}
            renderChatEmpty={() => <ChatEmptyComponent />}
            keyboardShouldPersistTaps="never"
          />

          {Platform.OS === "android" && (
            <KeyboardAvoidingView behavior="padding" />
          )}
        </>
      )}
    </View>
  );
}
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

const CustomMessageBubble = memo((props) => {
  return (
    <View shouldRasterizeIOS renderToHardwareTextureAndroid>
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "#000",
            fontSize: 14,
            fontFamily: "PlusJakartaSans_400Regular",
          },
          left: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },
        }}
        wrapperStyle={{
          left: { backgroundColor: colors.grey[50] },
          right: { backgroundColor: colors.primary[50] },
        }}
        // renderTicks={renderTicks}
      />
    </View>
  );
});

// const renderTicks = (message: ExtendedMessage) => {
//   if (message.user._id !== user!._id) return null;
//   if (message.received) {
//     // Double tick (✓✓) - Message Delivered
//     return (
//       <View style={{ flexDirection: "row", marginRight: 4 }}>
//         <Ionicons name="checkmark-done" size={12} color="green" />
//       </View>
//     );
//   } else if (message.sent) {
//     // Single tick (✓) - Message Sent
//     return (
//       <Ionicons
//         name="checkmark"
//         size={12}
//         color="gray"
//         style={{ marginRight: 4 }}
//       />
//     );
//   }
//   return null;
// };

const styles = StyleSheet.create({
  composer: {
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 14,
    // paddingTop: 2,
    fontFamily: "PlusJakartaSans_400Regular",
    // marginVertical: 4,
  },
});
