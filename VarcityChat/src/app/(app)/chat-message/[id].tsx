import { Platform, SafeAreaView, StyleSheet } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GiftedChat,
  GiftedChatProps,
  IMessage,
  InputToolbar,
  RenderMessageTextProps,
  SendProps,
} from "react-native-gifted-chat";
import { TouchableOpacity, View } from "@/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Swipeable } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { MessageRequest } from "@/components/chats/message-request";
import { useChatMessages } from "@/core/hooks/use-chat-messages";
import { ExtendedMessage } from "@/api/chats/types";
import { useAuth } from "@/core/hooks/use-auth";
import { useQuery } from "@realm/react";
import { useSocket } from "@/context/useSocketContext";
import { useChats } from "@/core/hooks/use-chats";
import { convertToGiftedChatMessage } from "@/core/utils";
import { MessageSchema } from "@/core/models/message-model";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { resetActiveChat } from "@/core/chats/chats-slice";
import { useTypingStatus } from "@/core/hooks/chatHooks/use-typing-status";
import { ChatInput } from "@/components/chats/chat-input";
import EmojiSelectSvg from "@/ui/icons/chat/emoji-select-svg";
import ChatMessageBox from "@/components/chats/chat-message-box";
import ReplyMessageBar from "@/components/chats/reply-message-bar";
import CustomMessageBubble from "@/components/chats/bubble";
import ChatEmptyComponent from "@/components/chats/chat-empty";
import SyncingMessagesComponent from "@/components/chats/sync-messages-loader";

let renderedCount = 0;
const MESSAGES_PER_PAGE = 60;

export default function ChatMessage() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { id: conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { isConnected, socket } = useSocket();
  const activeChat = useAppSelector((state) => state.chats.activeChat);
  const isConversationPending = activeChat?.chat.status === "pending";
  const isConversationRejected = activeChat?.chat.status === "rejected";
  const { updateChatCount } = useChats();
  const { sendMessage, syncMessagesFromBackend, isSyncing } = useChatMessages();
  const { isOtherUserTyping, handleTyping, stopTyping } = useTypingStatus({
    conversationId: `${conversationId}`,
    userId: user!._id,
    receiverId: `${activeChat?.receiver!._id}`,
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
    return () => {
      dispatch(resetActiveChat());
    };
  }, []);

  useEffect(() => {
    // update conversation unread count for current authenticated user
    socket?.emit("mark-conversation-as-read", {
      conversationId: conversationId as string,
      userId: user?._id,
      user1Id: activeChat!.chat?.user1._id,
      user2Id: activeChat!.chat?.user2._id,
    });
    updateChatCount(conversationId as string, 0, true);
  }, [conversationId, user, socket]);

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
        receiver: activeChat!.receiver!._id,
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
        renderSend: (props: SendProps<IMessage>) => (
          <ChatInput text={text} sendProps={props} />
        ),
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
      {isConversationPending && activeChat.chat?.user1._id !== user?._id ? (
        <MessageRequest chat={activeChat.chat!} />
      ) : isConversationRejected &&
        activeChat!.chat?.user1._id !== user?._id ? (
        <MessageRequest chat={activeChat.chat!} />
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

      {isSyncing && messagesFromRealm.length == 0 && !isConversationPending && (
        <SyncingMessagesComponent />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  composer: {
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  softInputStyles: {
    flex: 1,
  },
});
