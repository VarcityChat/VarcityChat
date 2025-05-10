import { IChat } from "@/api/chats/types";
import { ActivityIndicator, Text, View } from "@/ui";
import { TouchableOpacity } from "@/ui";
import { useActiveChat, useChats } from "@/core/hooks/use-chats";
import {
  useAcceptChatRequestMutation,
  useRejectChatRequestMutation,
} from "@/api/chats/chat-api";
import { useApi } from "@/core/hooks/use-api";
import { useAppDispatch } from "@/core/store/store";
import { updateActiveChat } from "@/core/chats/chats-slice";

export const MessageRequest = ({ chat }: { chat: IChat }) => {
  const dispatch = useAppDispatch();
  const { activeChatReceiver } = useActiveChat(chat._id);
  const { updateChatStatus } = useChats();
  const { callMutationWithErrorHandler } = useApi();

  const [acceptChatRequest, { isLoading: isAccpeting }] =
    useAcceptChatRequestMutation();
  const [rejectChatRequest, { isLoading: isRejecting }] =
    useRejectChatRequestMutation();

  const handleAcceptRequest = async () => {
    const { data } = await callMutationWithErrorHandler(() =>
      acceptChatRequest(chat._id).unwrap()
    );

    if (data) {
      updateChatStatus(chat._id, "accepted");
      dispatch(
        updateActiveChat({ chat: { _id: chat._id, status: "accepted" } })
      );
    }
  };
  const handleRejectRequest = async () => {
    const { data } = await callMutationWithErrorHandler(() =>
      rejectChatRequest(chat._id).unwrap()
    );
    if (data) {
      updateChatStatus(chat._id, "rejected");
      dispatch(
        updateActiveChat({ chat: { _id: chat._id, status: "rejected" } })
      );
    }
  };

  return (
    <View className="flex-1 justify-end items-center p-4">
      <Text className="text-lg font-sans-bold mb-2">Message Request</Text>
      <Text className="text-center text-grey-500 mb-4">
        {activeChatReceiver?.firstname} wants to start a conversation
      </Text>
      <View className="flex-row gap-4">
        {chat.status !== "rejected" && (
          <TouchableOpacity
            className="bg-grey-100 dark:bg-grey-500 px-6 py-3 rounded-full"
            onPress={handleRejectRequest}
          >
            {isRejecting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white">Decline</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="bg-primary-500 px-6 py-3 rounded-full"
          onPress={handleAcceptRequest}
        >
          {isAccpeting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white">Accept</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
