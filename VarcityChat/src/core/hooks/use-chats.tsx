import { LayoutAnimation } from "react-native";
import messagesApi, {
  selectChatById,
  useGetChatsQuery,
} from "@/api/chats/chat-api";
import { ExtendedMessage, IChat } from "@/api/chats/types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useAuth } from "./use-auth";
import { useMemo } from "react";

// Hooks for the chats screen
export const useChats = () => {
  const { user } = useAuth();
  const { data: chats, isLoading, refetch, error } = useGetChatsQuery();
  const dispatch = useAppDispatch();

  const totalUnreadCount = useMemo(() => {
    return (
      chats?.reduce((acc, chat) => {
        if (chat.user1._id === user?._id) {
          return acc + chat.unreadCountUser1;
        }
        return acc + chat.unreadCountUser2;
      }, 0) || 0
    );
  }, [chats, user]);

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
              lastMessage: {
                content: newMessage.content,
                mediaUrls: newMessage.mediaUrls,
                audio: newMessage?.audio,
              },
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

  const updateChatCount = (
    chatId: string,
    count: number,
    reset: boolean = false
  ) => {
    dispatch(
      messagesApi.util.updateQueryData(
        "getChats",
        undefined as any,
        (draft: IChat[]) => {
          const chat = draft.find((c) => c._id === chatId);
          if (chat) {
            if (chat.user1._id === user?._id) {
              chat.unreadCountUser1 = reset ? 0 : chat.unreadCountUser1 + count;
            } else {
              chat.unreadCountUser2 = reset ? 0 : chat.unreadCountUser2 + count;
            }
          }
        }
      )
    );
  };

  const updateUnreadChatCount = (
    conversationId: string,
    activeChat: IChat | undefined | null
  ) => {
    if (!activeChat) {
      updateChatCount(conversationId, 1);
      return;
    }
    if (activeChat && activeChat._id !== conversationId) {
      updateChatCount(conversationId, 1);
      return;
    }

    updateChatCount(conversationId, 0, true);
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
    updateUnreadChatCount,
    updateChatCount,
    error,
    totalUnreadCount,
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

  return {
    chat,
    activeChatReceiver,
    isPending: chat?.status === "pending",
    isRejected: chat?.status === "rejected",
  };
};
