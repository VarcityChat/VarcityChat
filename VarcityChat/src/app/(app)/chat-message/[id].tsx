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
  GiftedChatProps,
  IMessage,
  InputToolbar,
  RenderMessageTextProps,
  Send,
  SendProps,
} from "react-native-gifted-chat";
import { TouchableOpacity, View, Text, Image, colors } from "@/ui";
import { emptyChatImg } from "@/ui/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Swipeable } from "react-native-gesture-handler";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useActiveChat } from "@/core/hooks/use-chats";
import { MessageRequest } from "@/components/chats/message-request";
import { useChatMessages } from "@/core/hooks/use-chat-messages";
import { ExtendedMessage } from "@/api/chats/types";
import { useAuth } from "@/core/hooks/use-auth";
import { useQuery } from "@realm/react";
import { useSocket } from "@/context/SocketContext";
import { useChats } from "@/core/hooks/use-chats";
import { convertToGiftedChatMessage } from "@/core/utils";
import { MessageSchema } from "@/core/models/message-model";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { useAppDispatch } from "@/core/store/store";
import { setActiveChat, resetActiveChat } from "@/core/chats/chats-slice";
import { useTypingStatus } from "@/core/hooks/chatHooks/use-typing-status";
import MicrophoneSvg from "@/ui/icons/chat/microphone-svg";
import AttachmentSvg from "@/ui/icons/chat/attachment-svg";
import PictureSvg from "@/ui/icons/chat/picture-svg";
import SendSvg from "@/ui/icons/chat/send-svg";
import EmojiSelectSvg from "@/ui/icons/chat/emoji-select-svg";
import ChatMessageBox from "@/components/chats/chat-message-box";
import ReplyMessageBar from "@/components/chats/reply-message-bar";
import CustomMessageBubble from "@/components/chats/bubble";

let renderedCount = 0;
const MESSAGES_PER_PAGE = 60;

export default function ChatMessage() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { id: conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { isConnected, socket } = useSocket();
  const { chat, activeChatReceiver, isPending, isRejected } = useActiveChat(
    `${conversationId}`
  );
  const { updateChatCount } = useChats();
  const { sendMessage, syncMessagesFromBackend, isSyncing } = useChatMessages();
  const { isOtherUserTyping, handleTyping, stopTyping } = useTypingStatus({
    conversationId: `${conversationId}`,
    userId: user!._id,
    receiverId: activeChatReceiver!._id,
  });

  const messageContainerRef = useRef<FlatList>(null);
  const swipeableRef = useRef<Swipeable | null>(null);

  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [text, setText] = useState("");
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  const messagesFromRealm = useQuery(MessageSchema)
    .filtered(`conversationId == $0`, conversationId)
    .sorted([
      ["localSequence", true],
      ["serverSequence", true],
    ]);

  // console.log("CURRENT PAGE:", page);
  // console.log("RENDERED COUNT:", renderedCount++);

  useEffect(() => {
    if (isConnected) {
      syncMessagesFromBackend(conversationId as string);
    }
  }, [conversationId, isConnected]);

  useEffect(() => {
    if (chat) {
      dispatch(
        setActiveChat({
          chat,
          receiverId: `${activeChatReceiver?._id}`,
        })
      );
    }

    // update conversation unread count for current authenticated user
    socket?.emit("mark-conversation-as-read", {
      conversationId: conversationId as string,
      userId: user?._id,
      user1Id: chat?.user1._id,
      user2Id: chat?.user2._id,
    });
    updateChatCount(conversationId as string, 0, true);

    return () => {
      if (chat) dispatch(resetActiveChat());
    };
  }, [conversationId, user, socket, chat]);

  useEffect(() => {
    if (replyMessage && swipeableRef.current) {
      swipeableRef.current.close();
      swipeableRef.current = null;
    }
  }, [replyMessage]);

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

  const onSend = (messages: IMessage[]) => {
    stopTyping();
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
        receiver: activeChatReceiver!._id,
      } as unknown as ExtendedMessage,
      conversationId as string
    );
  };

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

  const chatProps = useMemo(
    () =>
      ({
        messageContainerRef,
        messages: messagesFromRealm
          .slice(0, page * MESSAGES_PER_PAGE)
          .map((message) =>
            convertToGiftedChatMessage(message as unknown as ExtendedMessage)
          ),
        listViewProps: {
          windowSize: 7,
          initialNumToRender: 25,
          maxToRenderPerBatch: 50,
          updateCellsBatchingPeriod: 50,
          removeCliippedSubviews: true,
        },
        onSend: (messages: any) => onSend(messages),
        user: { _id: user!._id },
        renderBubble: (props) => <CustomMessageBubble {...props} />,
        onInputTextChanged: (text) => {
          setText(text);
          handleTyping(text);
        },
        isTyping: isOtherUserTyping,
        renderAvatar: null,
        maxComposeHeight: 100,
        timeTextStyle: { right: { color: "gray" }, left: { color: "grey" } },
        renderSend: renderSend,
        textInputProps: styles.composer,
        scrollToBottom: true,
        infiniteScroll: true,
        loadEarlier: hasMoreMessages,
        onLoadEarlier: loadEarlier,
        renderChatEmpty: () => (isSyncing ? null : <ChatEmptyComponent />),
        keyboardShouldPersistTaps: "never",
      } as GiftedChatProps),
    [
      messagesFromRealm,
      page,
      text,
      hasMoreMessages,
      isOtherUserTyping,
      isSyncing,
    ]
  );

  return (
    <SafeAreaView className="flex flex-1">
      {isPending && chat?.user1._id !== user?._id ? (
        <MessageRequest chat={chat!} />
      ) : isRejected && chat?.user1._id !== user?._id ? (
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
            {...chatProps}
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
            isKeyboardInternallyHandled={false}
          />
        </AvoidSoftInputView>
      ) : (
        <GiftedChat {...chatProps} />
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
