import { InteractionManager, Platform, StyleSheet } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BubbleProps,
  GiftedChatProps,
  IMessage,
  InputToolbarProps,
  MessageProps,
} from "react-native-gifted-chat";
import { colors, View } from "@/ui";
import { Audio } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { MessageRequest } from "@/components/chats/message-request";
import { useChatMessages } from "@/core/hooks/use-chat-messages";
import { DELIVERY_STATUSES, ExtendedMessage } from "@/api/chats/types";
import { useAuth } from "@/core/hooks/use-auth";
import { useQuery } from "@realm/react";
import { useSocket } from "@/context/useSocketContext";
import { useChats } from "@/core/hooks/use-chats";
import {
  convertToGiftedChatMessage,
  formatChatReplyMessage,
} from "@/core/utils";
import { uploadToCloudinaryWithProgress } from "@/core/upload-utils";
import { MessageSchema } from "@/core/models/message-model";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { resetActiveChat } from "@/core/chats/chats-slice";
import { useTypingStatus } from "@/core/hooks/chatHooks/use-typing-status";
import { ChatFooter } from "@/components/chats/chat-footer";
import ChatMessageBox from "@/components/chats/chat-message-box";
import ReplyMessageBar from "@/components/chats/reply-message-bar";
import CustomMessageBubble from "@/components/chats/bubble";
import ChatEmptyComponent from "@/components/chats/chat-empty";
import SyncingMessagesComponent from "@/components/chats/sync-messages-loader";
import { UploadingImage } from "@/types/chat";
import { ImagePickerAsset } from "expo-image-picker";
import { useToast } from "@/core/hooks/use-toast";
import { useColorScheme } from "nativewind";
import { ChatInput } from "@/components/chats/chat-input";
import { useAudioUpload } from "@/core/hooks/chatHooks/use-audio-upload";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { MessageInputContainer } from "@/components/chats/message-input-container";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

const MESSAGES_PER_PAGE = 100;
let renderCount = 0;
export default function ChatMessage() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { id: conversationId } = useLocalSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { isConnected, socket } = useSocket();
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";
  const activeChat = useAppSelector((state) => state.chats.activeChat);
  const isConversationPending = activeChat?.chat.status === "pending";
  const isConversationRejected = activeChat?.chat.status === "rejected";

  const { updateChatCount } = useChats();
  const {
    generateLocalId,
    sendMessage,
    syncMessagesFromBackend,
    addAudioMessageToRealm,
    updateAudioMessage,
    markAudioUploadFailed,
    isSyncing,
  } = useChatMessages();
  const { isOtherUserTyping, handleTyping, stopTyping } = useTypingStatus({
    conversationId: `${conversationId}`,
    userId: user!._id,
    receiverId: `${activeChat?.receiver!._id}`,
  });
  const { handleUploadAudio, handleCancelAudioUpload } = useAudioUpload();
  const { stopAllPlayers } = useAudioPlayer();

  const messageContainerRef = useRef<FlatList>(null);
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const currentReplyMessageRef = useRef<IMessage | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);

  const messagesFromRealm = useQuery(MessageSchema)
    .filtered(`conversationId == $0`, conversationId)
    .sorted([
      ["localSequence", true],
      ["serverSequence", true],
    ]);

  const messages = useMemo(() => {
    console.log("RE-RENDERED:", renderCount++);
    return messagesFromRealm
      .slice(0, page * MESSAGES_PER_PAGE)
      .map((message) => {
        const detachedMessage = {
          _id: message?._id.toString(),
          conversationId: message?.conversationId,
          content: message?.content,
          createdAt: message?.createdAt
            ? new Date(message?.createdAt)
            : new Date(),
          deliveryStatus: message?.deliveryStatus,
          sender: message?.sender,
          receiver: message?.receiver,
          mediaUrls: message?.mediaUrls ? [...message.mediaUrls] : undefined,
          audio: message?.audio,
          reply: message?.reply ? { ...message.reply } : undefined,
        };
        return convertToGiftedChatMessage(
          detachedMessage as unknown as ExtendedMessage
        );
      });
  }, [messagesFromRealm, page]);

  useEffect(() => {
    if (isConnected) {
      socket?.emit("get-user-activity", activeChat?.receiver!._id);
      syncMessagesFromBackend(conversationId as string);
    }
  }, [conversationId, isConnected]);

  // Chats screen cleanup
  useEffect(() => {
    return () => {
      // Cancel all ongoing uploads
      uploadingImages.forEach((img) => {
        if (img.abortController) {
          img.abortController.abort();
        }
      });
      setUploadingImages([]);
      setIsRecording(false);
      handleCancelAudioUpload();
      stopAllPlayers();
      dispatch(resetActiveChat());

      // Clear swipeable references
      if (swipeableRef.current) {
        swipeableRef.current.close();
        swipeableRef.current = null;
      }
      currentReplyMessageRef.current = null;
      setReplyMessage(null);
    };
  }, []);

  useEffect(() => {
    socket?.emit("mark-conversation-as-read", {
      conversationId: conversationId as string,
      userId: user?._id,
      user1Id: activeChat!.chat?.user1._id,
      user2Id: activeChat!.chat?.user2._id,
    });
    updateChatCount(`${conversationId}`, 0, true);
  }, [conversationId, user?._id, socket]);

  useEffect(() => {
    if (replyMessage && swipeableRef.current) {
      setTimeout(() => {
        if (swipeableRef.current) {
          swipeableRef.current?.close();
          swipeableRef.current = null;
        }
      }, 150);
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

  const handleSetReplyMessage = useCallback(
    (message: IMessage, swipeable: SwipeableMethods | null) => {
      setReplyMessage(message);
      currentReplyMessageRef.current = message;
      if (swipeable) {
        swipeableRef.current = swipeable;
      }
    },
    []
  );

  const handleClearReplyMessage = useCallback(() => {
    setReplyMessage(null);
    currentReplyMessageRef.current = null;
  }, []);

  const scrollToMessage = useCallback(
    (messageId: string) => {
      try {
        const messages = messagesFromRealm
          .slice(0, page * MESSAGES_PER_PAGE)
          .map((message) =>
            convertToGiftedChatMessage(message as unknown as ExtendedMessage)
          );
        const index = messages.findIndex((msg) => msg._id === messageId);
        if (index !== -1 && messageContainerRef.current) {
          setTimeout(() => {
            messageContainerRef.current?.scrollToIndex({
              index,
              animated: true,
              viewOffset: 50,
            });
          }, 100);
        }
      } catch (err) {}
    },
    [messagesFromRealm, page]
  );

  const handleSend = useCallback(
    (messages: IMessage[]) => {
      messageContainerRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });

      InteractionManager.runAfterInteractions(() => {
        stopTyping();

        // Check if they are images
        const mediaUrls = uploadingImages
          .filter((img) => img.cloudinaryUrl)
          .map((img) => img.cloudinaryUrl) as string[];

        const currentReplyMessage = currentReplyMessageRef.current;
        const replyData = currentReplyMessage
          ? {
              reply: {
                messageId: currentReplyMessage._id,
                content: formatChatReplyMessage(currentReplyMessage as any),
                sender: currentReplyMessage.user._id,
                receiver:
                  currentReplyMessage.user._id === user!._id
                    ? activeChat!.receiver!._id
                    : user!._id,
              },
            }
          : {};
        handleClearReplyMessage();

        const message = messages[0];
        sendMessage(
          {
            conversationId: conversationId as string,
            content: message.text,
            sender: user!._id,
            senderName: user?.firstname,
            receiver: activeChat!.receiver!._id,
            mediaUrls,
            ...replyData,
          } as unknown as ExtendedMessage,
          `${conversationId}`
        );
        setUploadingImages([]);
      });
    },
    [conversationId, uploadingImages, stopTyping, sendMessage, user, activeChat]
  );

  const handleAudioSend = useCallback(
    (audioUri: string) => {
      messageContainerRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });

      InteractionManager.runAfterInteractions(async () => {
        const localId = generateLocalId();
        try {
          // optimistic update
          addAudioMessageToRealm(
            {
              conversationId: `${conversationId}`,
              sender: user!._id,
              receiver: activeChat!.receiver!._id,
              audio: audioUri,
              content: "",
            } as unknown as ExtendedMessage,
            localId,
            `${conversationId}`
          );

          // Start the upload process
          const result = await handleUploadAudio(audioUri);
          if (result && result?.url) {
            updateAudioMessage(localId, result.url);
          } else {
            markAudioUploadFailed(localId);
            showToast({
              type: "error",
              text1: "Error",
              text2: "An error occurred during audio upload",
            });
          }
        } catch (error) {
          markAudioUploadFailed(localId);
          showToast({
            type: "error",
            text1: "Error",
            text2: "An error occurred when uploading the audio",
          });
        }
      });
    },
    [
      generateLocalId,
      addAudioMessageToRealm,
      markAudioUploadFailed,
      showToast,
      handleUploadAudio,
    ]
  );

  const handleImageSelected = useCallback(
    async (images: ImagePickerAsset[]) => {
      const newImages = images.map((img) => ({
        uri: img.uri,
        progress: 0,
        abortController: new AbortController(),
        error: false,
      }));
      setUploadingImages((prev) => [...prev, ...newImages]);

      const uploadPromises = newImages.map(async (img) => {
        try {
          const cloudinaryUrl = await uploadToCloudinaryWithProgress(
            img,
            (progress) => {
              setUploadingImages((prev) =>
                prev.map((p) => (p.uri === img.uri ? { ...p, progress } : p))
              );
            },
            img.abortController!
          );

          setUploadingImages((prev) =>
            prev.map((p) =>
              p.uri === img.uri
                ? { ...p, cloudinaryUrl: `${cloudinaryUrl}` }
                : p
            )
          );
        } catch (error: any) {
          if (error.message === "Upload cancelled") {
            setUploadingImages((prev) => prev.filter((p) => p.uri !== img.uri));
          } else {
            setUploadingImages((prev) =>
              prev.map((p) => (p.uri === img.uri ? { ...p, error: true } : p))
            );
            showToast({
              type: "error",
              text1: "Error",
              text2: "Error uploading images",
            });
          }
        }
      });

      await Promise.all(uploadPromises);
    },
    [setUploadingImages, showToast]
  );

  const handleRemoveImage = useCallback(
    (uri: string) => {
      const image = uploadingImages.find((img) => img.uri === uri);
      if (image?.abortController) {
        image.abortController.abort();
      }
      setUploadingImages((prev) => prev.filter((p) => p.uri !== uri));
    },
    [uploadingImages, setUploadingImages]
  );

  const renderBubble = useCallback(
    (props: BubbleProps<ExtendedMessage>) => (
      <CustomMessageBubble {...props} onReplyPress={scrollToMessage} />
    ),
    [scrollToMessage]
  );

  const renderMessage = useCallback(
    (props: MessageProps<any>) => (
      <ChatMessageBox {...props} setReplyOnSwipe={handleSetReplyMessage} />
    ),
    []
  );

  const renderChatEmpty = useCallback(
    () => (isSyncing ? null : <ChatEmptyComponent />),
    [isSyncing]
  );

  const renderChatFooter = useCallback(
    () =>
      replyMessage && uploadingImages.length === 0 ? (
        <ReplyMessageBar
          clearReply={handleClearReplyMessage}
          message={replyMessage}
        />
      ) : (
        <ChatFooter
          uploadingImages={uploadingImages}
          onRemoveImage={handleRemoveImage}
        />
      ),
    [replyMessage, uploadingImages, handleRemoveImage, handleClearReplyMessage]
  );

  const renderInputToolbar = useCallback(
    (
      props: React.JSX.IntrinsicAttributes &
        InputToolbarProps<IMessage> & {
          isRecording: boolean;
          setIsRecording: (isRecording: boolean) => void;
          onAudioSend: (audioUri: string) => void;
        }
    ) => (
      <ChatInput
        {...props}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        onAudioSend={handleAudioSend}
      />
    ),
    [handleAudioSend, isRecording, setIsRecording]
  );

  const chatProps = useMemo(
    () =>
      ({
        messageContainerRef,
        messages,
        listViewProps: {
          windowSize: 20,
          initialNumToRender: 25,
          maxToRenderPerBatch: 50,
          updateCellsBatchingPeriod: 50,
          removeCliippedSubviews: Platform.OS === "android",
          onScrollToIndexFailed: (_info: any) => {},
          // maintainVisibleContentPosition: {
          //   minIndexForVisible: 1,
          //   autoScrollToTopThreshold: 0,
          // },
          // viewabilityConfig: {
          //   itemVisiblePercenThreshold: 50,
          // },
        },
        onSend: (messages: IMessage[]) => handleSend(messages),
        user: { _id: user!._id },
        renderBubble,
        placeholder:
          uploadingImages.length > 0 ? "Add a caption..." : "Type a message...",
        isTyping: isOtherUserTyping,
        renderAvatar: null,
        timeTextStyle: { right: { color: "gray" }, left: { color: "grey" } },
        textInputProps: {
          ...styles.composer,
          color: isDark ? colors.white : colors.black,
        },
        scrollToBottom: true,
        infiniteScroll: true,
        loadEarlier: hasMoreMessages,
        maxInputLength: 2000,
        onLoadEarlier: loadEarlier,
        renderChatEmpty,
        renderChatFooter,
        renderInputToolbar,
        renderMessage,
        keyboardShouldPersistTaps: "never",
      } as GiftedChatProps),
    [
      messages,
      page,
      hasMoreMessages,
      isOtherUserTyping,
      isSyncing,
      uploadingImages,
      isRecording,
    ]
  );

  return (
    <View
      className="flex flex-1 bg-white dark:bg-black"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex flex-1 bg-white dark:bg-charcoal-950">
        {isConversationPending &&
        activeChat.chat?.user1?._id &&
        activeChat.chat?.user1._id !== user?._id ? (
          <MessageRequest chat={activeChat.chat!} />
        ) : isConversationRejected &&
          activeChat.chat?.user1?._id &&
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
            <MessageInputContainer
              {...chatProps}
              isRecording={isRecording}
              onInputTextChanged={(text: string) => handleTyping(text)}
              setIsRecording={setIsRecording}
              uploadingImages={uploadingImages}
              onImageSelected={handleImageSelected}
              onAudioSend={handleAudioSend}
              isKeyboardInternallyHandled={false}
              replyMessage={replyMessage}
            />
          </AvoidSoftInputView>
        ) : (
          <MessageInputContainer
            {...chatProps}
            onInputTextChanged={(text: string) => handleTyping(text)}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            uploadingImages={uploadingImages}
            onImageSelected={handleImageSelected}
            onAudioSend={handleAudioSend}
            replyMessage={replyMessage}
          />
        )}

        {isSyncing &&
          messagesFromRealm.length == 0 &&
          !isConversationPending && <SyncingMessagesComponent />}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  composer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  softInputStyles: {
    flex: 1,
  },
});
