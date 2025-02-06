import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  addMessage,
  setLoadingState,
  updateMessage,
  upsertMessages,
} from "../chats/message-slice";
import { MessagePersistenceManager } from "../services/chat-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExtendedMessage } from "@/api/chats/types";
import { useSocket } from "@/context/SocketContext";

export const useChatMessages = (chatId: string) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(
    (state) => state.messages.chatMessages[chatId] || []
  );
  const loading = useAppSelector(
    (state) => state.messages.loadingStates[chatId]
  );
  const { socket } = useSocket();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    dispatch(setLoadingState({ chatId, loading: true }));

    try {
      // Load from local storage first
      const localMessages = await MessagePersistenceManager.loadMessages(
        chatId
      );
      if (localMessages.length > 0) {
        dispatch(upsertMessages(localMessages));
      }

      // Then fetch from server for updates
      const lastSync = await AsyncStorage.getItem(
        `${MessagePersistenceManager.STORAGE_PREFIX}${chatId}`
      );
      const serverMessages = await fetchMessagesFromServer(chatId, lastSync);

      if (serverMessages.length > 0) {
        dispatch(upsertMessages(serverMessages));
        await MessagePersistenceManager.saveMessages(chatId, serverMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      dispatch(setLoadingState({ chatId, loading: false }));
    }
  };

  const sendMessage = async (message: ExtendedMessage) => {
    // optimistic update
    const optimisticMessage: ExtendedMessage = {
      ...message,
      localId: Date.now().toString(),
      deliveryStatus: "sent" as const,
    };

    dispatch(addMessage(optimisticMessage));
    await MessagePersistenceManager.saveMessages(chatId, [optimisticMessage]);

    try {
      // Send via socket
      socket?.emit("send_message", message, async (response: any) => {
        if (response.success) {
          const updatedMessage = {
            ...message,
            _id: response.message._id,
            deliveryStatus: "sent" as const,
          };
          dispatch(updateMessage({ id: message._id, changes: updatedMessage }));
          MessagePersistenceManager.updateMessage(chatId, updatedMessage).catch(
            (error) =>
              console.error(`Failed to update persisted message:`, error)
          );
        }
      });
    } catch (error) {
      // Revert optimistic update
      dispatch(
        updateMessage({
          id: optimisticMessage._id,
          changes: { deliveryStatus: "failed" as const },
        })
      );
    }
  };

  const updateMessageStatus = async (
    messageId: string,
    status: "sent" | "delivered" | "read"
  ) => {
    dispatch(
      updateMessage({ id: messageId, changes: { deliveryStatus: status } })
    );

    // update in local storage
    // const message = messages.find((m) => m === messageId);
    // if (message) {
    //   const updatedMessage = { ...message, deliveryStatus: status };
    //   await MessagePersistenceManager.updateMessage(chatId, updatedMessage);
    // }
  };

  return { messages, loading, sendMessage, updateMessageStatus, loadMessages };
};

async function fetchMessagesFromServer(
  chatId: string,
  lastSync: string | null
): Promise<ExtendedMessage[]> {
  return Promise.resolve([] as ExtendedMessage[]);
}
