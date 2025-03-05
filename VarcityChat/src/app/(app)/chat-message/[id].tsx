import { Platform, SafeAreaView, StyleSheet } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BubbleProps,
  GiftedChat,
  GiftedChatProps,
  IMessage,
  SendProps,
} from "react-native-gifted-chat";
import { colors, View } from "@/ui";
import { Audio } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Swipeable } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { MessageRequest } from "@/components/chats/message-request";
import { useChatMessages } from "@/core/hooks/use-chat-messages";
import { DELIVERY_STATUSES, ExtendedMessage } from "@/api/chats/types";
import { useAuth } from "@/core/hooks/use-auth";
import { useQuery } from "@realm/react";
import { useSocket } from "@/context/useSocketContext";
import { useChats } from "@/core/hooks/use-chats";
import { convertToGiftedChatMessage } from "@/core/utils";
import { uploadToCloudinaryWithProgress } from "@/core/upload-utils";
import { MessageSchema } from "@/core/models/message-model";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { resetActiveChat } from "@/core/chats/chats-slice";
import { useTypingStatus } from "@/core/hooks/chatHooks/use-typing-status";
import { CustomSend } from "@/components/chats/custom-send";
import { ChatFooter } from "@/components/chats/chat-footer";
import EmojiSelectSvg from "@/ui/icons/chat/emoji-select-svg";
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

let renderedCount = 0;
const MESSAGES_PER_PAGE = 60;

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
  const swipeableRef = useRef<Swipeable | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [text, setText] = useState("");
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);

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

  // Chats screen cleanup
  useEffect(() => {
    return () => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });

      if (isRecording) {
        console.log("RECORDING was active during cleanup");
        setIsRecording(false);
      }

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
    };
  }, []);

  useEffect(() => {
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
    messageContainerRef?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    stopTyping();

    // Check if they are images
    const mediaUrls = uploadingImages
      .filter((img) => img.cloudinaryUrl)
      .map((img) => img.cloudinaryUrl) as string[];

    const message = messages[0];
    sendMessage(
      {
        conversationId: conversationId as string,
        content: message.text,
        sender: user!._id,
        receiver: activeChat!.receiver!._id,
        mediaUrls,
      } as unknown as ExtendedMessage,
      `${conversationId}`
    );
    setUploadingImages([]);
  };

  const handleAudioSend = async (audioUri: string) => {
    messageContainerRef?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
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
  };

  const handleImageSelected = async (images: ImagePickerAsset[]) => {
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
            p.uri === img.uri ? { ...p, cloudinaryUrl: `${cloudinaryUrl}` } : p
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
  };

  const handleRemoveImage = (uri: string) => {
    const image = uploadingImages.find((img) => img.uri === uri);
    if (image?.abortController) {
      image.abortController.abort();
    }
    setUploadingImages((prev) => prev.filter((p) => p.uri !== uri));
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
        renderBubble: (
          props: BubbleProps<
            IMessage & {
              mediaUrls: string[];
              deliveryStatus: DELIVERY_STATUSES;
            }
          >
        ) => <CustomMessageBubble {...props} />,
        onInputTextChanged: (text) => {
          setText(text);
          handleTyping(text);
        },
        placeholder:
          uploadingImages.length > 0 ? "Add a caption..." : "Type a message...",
        isTyping: isOtherUserTyping,
        renderAvatar: null,
        maxComposerHeight: 100,
        timeTextStyle: { right: { color: "gray" }, left: { color: "grey" } },
        renderSend: (props: SendProps<IMessage>) => (
          <CustomSend
            text={text}
            sendProps={props}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            uploadingImages={uploadingImages}
            onImageSelected={handleImageSelected}
          />
        ),
        textInputProps: {
          ...styles.composer,
          color: isDark ? colors.white : colors.black,
        },
        scrollToBottom: true,
        infiniteScroll: true,
        loadEarlier: hasMoreMessages,
        maxInputLength: 2000,
        onLoadEarlier: loadEarlier,
        renderChatEmpty: () => (isSyncing ? null : <ChatEmptyComponent />),
        renderChatFooter: () => (
          <ChatFooter
            uploadingImages={uploadingImages}
            onRemoveImage={handleRemoveImage}
          />
        ),
        renderInputToolbar: (props) => (
          <ChatInput
            {...props}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onAudioSend={handleAudioSend}
          />
        ),
        keyboardShouldPersistTaps: "never",
      } as GiftedChatProps),
    [
      messagesFromRealm,
      page,
      text,
      hasMoreMessages,
      isOtherUserTyping,
      isSyncing,
      uploadingImages,
      isRecording,
      handleAudioSend,
    ]
  );

  return (
    <View
      className="flex flex-1 bg-white dark:bg-black"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex flex-1 bg-white dark:bg-charcoal-950">
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
          !isConversationPending && <SyncingMessagesComponent />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  softInputStyles: {
    flex: 1,
  },
});
