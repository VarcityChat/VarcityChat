import { LayoutAnimation } from "react-native";
import messagesApi, {
  selectChatById,
  useGetChatsQuery,
} from "@/api/chats/messages-api";
import { ExtendedMessage, IChat } from "@/api/chats/types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useAuth } from "./use-auth";

export const useChats = () => {
  const { data: chats, isLoading, refetch, error } = useGetChatsQuery();
  const dispatch = useAppDispatch();

  const updateChatOrder = (newMessage: ExtendedMessage) => {
    // configure animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    dispatch(
      messagesApi.util.updateQueryData(
        "getChats",
        undefined,
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
              lastMessage: newMessage.content as string,
              lastMessageTimestamp: newMessage.createdAt
                ? newMessage.createdAt
                : new Date(),
            });
          }
        }
      )
    );
  };

  const loadChats = async () => {
    // Trigger refetch of chats
    await refetch();
  };

  return { chats, isLoading, loadChats, updateChatOrder, error };
};

export const useActiveChat = (chatId: string) => {
  const chat = useAppSelector(selectChatById(chatId));
  const { user } = useAuth();

  const activeChatUser = chat
    ? chat.user1._id === user?._id
      ? chat.user2
      : chat.user1
    : null;

  return { chat, activeChatUser };
};
