import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  SendProps,
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
import { FlatList, Swipeable } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useActiveChat } from "@/core/hooks/use-chats";
import { MessageRequest } from "@/components/chats/message-request";
import { useChatMessages } from "@/core/hooks/use-chat-messages";
import { ExtendedMessage } from "@/api/chats/types";
import { useAuth } from "@/core/hooks/use-auth";
import { useQuery } from "@realm/react";
import { convertToGiftedChatMessage } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import { MessageSchema } from "@/core/models/message-model";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { useSocket } from "@/context/SocketContext";

let renderedCount = 0;
const MESSAGES_PER_PAGE = 60;

export default function ChatMessage() {
  const insets = useSafeAreaInsets();
  const { id: conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const messageContainerRef = useRef<FlatList>(null);

  const { chat, activeChatUser, isPending, isRejected } = useActiveChat(
    conversationId as string
  );
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [text, setText] = useState("");

  const { sendMessage, syncMessagesFromBackend, isSyncing } = useChatMessages();

  const messagesFromRealm = useQuery(MessageSchema)
    .filtered(`conversationId == $0`, conversationId)
    .sorted([
      ["localSequence", true],
      ["serverSequence", true],
    ]);

  // console.log("CURRENT PAGE:", page);

  const swipeableRef = useRef<Swipeable | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  console.log("RENDERED COUNT:", renderedCount++);

  useEffect(() => {
    if (isConnected) {
      syncMessagesFromBackend(conversationId as string);
    }
  }, [conversationId, isConnected]);

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

  const onSend = useCallback(
    (messages: IMessage[]) => {
      // Scroll message list to bottom when a new message is sent
      messageContainerRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });

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
    },
    [conversationId]
  );

  useEffect(() => {
    if (
      (page + 1) * MESSAGES_PER_PAGE <= messagesFromRealm.length &&
      !hasMoreMessages
    ) {
      setHasMoreMessages(true);
    }
  }, [messagesFromRealm.length, page, hasMoreMessages]);

  const loadEarlier = useCallback(() => {
    if ((page + 1) * MESSAGES_PER_PAGE >= messagesFromRealm.length) {
      setHasMoreMessages(false);
    }
    setPage((prev) => prev + 1);
  }, [page, messagesFromRealm.length]);

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

  const renderSend = (sendProps: SendProps<IMessage>) => {
    return (
      <View className="flex flex-row items-center justify-center gap-2 h-[44px] px-4">
        {text.length > 0 && (
          <Send {...sendProps} containerStyle={{ justifyContent: "center" }}>
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
    );
  };

  return (
    <SafeAreaView className="flex flex-1">
      {isPending && chat?.user1._id !== user?._id ? (
        <MessageRequest chat={chat!} />
      ) : isRejected ? (
        <MessageRequest chat={chat!} />
      ) : Platform.OS === "ios" ? (
        <AvoidSoftInputView
          avoidOffset={10}
          hideAnimationDelay={50}
          hideAnimationDuration={200}
          showAnimationDelay={50}
          showAnimationDuration={200}
          style={styles.softInputStyles}
        >
          <GiftedChat
            messageContainerRef={messageContainerRef}
            messages={messagesFromRealm
              .slice(0, page * MESSAGES_PER_PAGE)
              .map((message) =>
                convertToGiftedChatMessage(
                  message as unknown as ExtendedMessage
                )
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
            renderAvatar={null}
            maxComposerHeight={100}
            timeTextStyle={{ right: { color: "green" } }}
            renderSend={renderSend}
            textInputProps={styles.composer}
            scrollToBottom={true}
            infiniteScroll
            loadEarlier={hasMoreMessages}
            onLoadEarlier={loadEarlier}
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
            isKeyboardInternallyHandled={false}
          />
        </AvoidSoftInputView>
      ) : (
        <GiftedChat
          messageContainerRef={messageContainerRef}
          messages={messagesFromRealm
            .slice(0, page * MESSAGES_PER_PAGE)
            .map((message) =>
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
          renderAvatar={null}
          maxComposerHeight={100}
          timeTextStyle={{ right: { color: "green" } }}
          renderSend={renderSend}
          textInputProps={styles.composer}
          scrollToBottom={true}
          infiniteScroll
          loadEarlier={hasMoreMessages}
          onLoadEarlier={loadEarlier}
          renderChatEmpty={() => (isSyncing ? null : <ChatEmptyComponent />)}
          keyboardShouldPersistTaps="never"
        />
      )}

      {isSyncing &&
        messagesFromRealm.length == 0 &&
        chat?.status !== "pending" && <SyncingMessagesComponent />}
    </SafeAreaView>
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

const SyncingMessagesComponent = memo(() => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 z-10">
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-white mb-4 -mt-20">Syncing messages...</Text>
        <ActivityIndicator color="white" size="small" />
      </View>
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
  softInputStyles: {
    flex: 1,
  },
});
