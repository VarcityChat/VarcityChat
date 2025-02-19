import { LayoutAnimation } from "react-native";
import messagesApi, {
  selectChatById,
  useGetChatsQuery,
} from "@/api/chats/chat-api";
import { ExtendedMessage, IChat } from "@/api/chats/types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useAuth } from "./use-auth";

// Hooks for the chats screen
export const useChats = () => {
  const { data: chats, isLoading, refetch, error } = useGetChatsQuery();
  const dispatch = useAppDispatch();

  const updateChatOrder = (newMessage: Partial<ExtendedMessage>) => {
    // configure animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    dispatch(
      messagesApi.util.updateQueryData(
        "getChats",
        undefined as any,
        (draft: IChat[]) => {
          const chatIndex = draft.findIndex(
            (chat) => chat._id === newMessage.conversationId
          );
          if (chatIndex > -1) {
            const chat = draft[chatIndex];
            // remove current chat from position
            draft.splice(chatIndex, 1);
            // add to beginning with update message
            draft.unshift({
              ...chat,
              lastMessage: { content: newMessage.content },
              lastMessageTimestamp: newMessage.createdAt
                ? newMessage.createdAt.toString()
                : new Date().toString(),
            });
          }
        }
      )
    );
  };

  const updateChatStatus = (
    chatId: string,
    status: "accepted" | "rejected" | "pending"
  ) => {
    dispatch(
      messagesApi.util.updateQueryData(
        "getChats",
        undefined as any,
        (draft: IChat[]) => {
          const chat = draft.find((chat) => chat._id === chatId);
          if (chat) {
            chat.status = status;
          }
        }
      )
    );
  };

  // Trigger refetch of chats
  const loadChats = async () => {
    await refetch();
  };

  return {
    chats,
    isLoading,
    loadChats,
    updateChatOrder,
    updateChatStatus,
    error,
  };
};

// Hook for handling active chat
export const useActiveChat = (chatId: string) => {
  let chat = useAppSelector(selectChatById(chatId));
  const { user } = useAuth();

  let activeChatReceiver = chat
    ? chat.user1._id === user?._id
      ? chat.user2
      : chat.user1
    : null;

  const resetActiveChat = () => {
    chat = null;
    activeChatReceiver = null;
  };

  return {
    chat,
    activeChatReceiver,
    resetActiveChat,
    isPending: chat?.status === "pending",
    isRejected: chat?.status === "rejected",
  };
};
