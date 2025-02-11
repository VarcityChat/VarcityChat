import { createEntityAdapter } from "@reduxjs/toolkit";
import { api } from "@/api/api";
import { IChat, ExtendedMessage, IUpdateChatRequest } from "./types";
import { RootState } from "@/core/store/store";

// Create entity adapter for normalized state management
export const messagesAdapter = createEntityAdapter({
  selectId: (message: ExtendedMessage) => message._id,
  sortComparer: (a, b) =>
    (b?.createdAt?.getTime() || 0) - (a?.createdAt?.getTime() || 0),
});

export const messagesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMessages: builder.query<ExtendedMessage[], string>({
      query: (chatId) => ({
        url: `/messages/${chatId}`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
    getChats: builder.query<IChat[], void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
      transformResponse: (response: { list: IChat[] }) => response.list,
      providesTags: ["Chats"],
    }),

    initializeConversation: builder.mutation<{}, string>({
      query: (targetUserId) => ({
        url: "/chat/open",
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: ["Chats"],
    }),

    acceptChatRequest: builder.mutation<IUpdateChatRequest, string>({
      query: (chatId) => ({
        url: `/chat/accept`,
        method: "PUT",
        body: { conversationId: chatId },
      }),
      invalidatesTags: ["Chats"],
    }),

    rejectChatRequest: builder.mutation<IUpdateChatRequest, string>({
      query: (chatId) => ({
        url: `/chat/reject`,
        method: "PUT",
        body: { conversationId: chatId },
      }),
      invalidatesTags: ["Chats"],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetMessagesQuery,
  useAcceptChatRequestMutation,
  useRejectChatRequestMutation,
  useInitializeConversationMutation,
} = messagesApi;

export default messagesApi;

export const selectChatById = (chatId: string) => (state: RootState) => {
  return (
    messagesApi.endpoints.getChats
      .select()(state)
      .data?.find((chat) => chat._id === chatId) || null
  );
};
