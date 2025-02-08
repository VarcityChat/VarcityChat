import { LayoutAnimation } from "react-native";
import messagesApi, {
  selectChatById,
  useGetChatsQuery,
} from "@/api/chats/chat-api";
import { ExtendedMessage, IChat } from "@/api/chats/types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useAuth } from "./use-auth";

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
    status: "accepted" | "rejected"
  ) => {
    dispatch(
      messagesApi.util.updateQueryData(
        "getChats",
        undefined as any,
        (draft: IChat[]) => {
          const chatIndex = draft.findIndex((chat) => chat._id === chatId);
          if (chatIndex > -1) {
            draft[chatIndex].status = status;
          }
        }
      )
    );
  };

  const loadChats = async () => {
    // Trigger refetch of chats
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

export const useActiveChat = (chatId: string) => {
  const chat = useAppSelector(selectChatById(chatId));
  const { user } = useAuth();

  const activeChatUser = chat
    ? chat.user1._id === user?._id
      ? chat.user2
      : chat.user1
    : null;

  return {
    chat,
    activeChatUser,
    isPending: chat?.status === "pending",
  };
};
