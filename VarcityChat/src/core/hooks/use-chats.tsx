import { LayoutAnimation } from "react-native";
import messagesApi, { useGetChatsQuery } from "@/api/chats/messages-api";
import { ExtendedMessage, IChat } from "@/api/chats/types";
import { useAppDispatch } from "../store/store";

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
