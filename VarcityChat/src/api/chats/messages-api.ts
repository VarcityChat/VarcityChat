import { createEntityAdapter } from "@reduxjs/toolkit";
import { api } from "@/api/api";
import { Chat, ExtendedMessage } from "./types";

// Create entity adapter for normalized state management
export const messagesAdapter = createEntityAdapter({
  selectId: (message: ExtendedMessage) => message._id,
  sortComparer: (a, b) =>
    (b?.createdAt?.getTime() || 0) - (a?.createdAt?.getTime() || 0),
});

const messagesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMessages: builder.query<ExtendedMessage[], string>({
      query: (chatId) => ({
        url: `/messages/${chatId}`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
    getChats: builder.query<Chat[], void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
      transformResponse: (response: { list: Chat[] }) => response.list,
      providesTags: ["Chats"],
    }),
  }),
});

export const { useGetChatsQuery, useGetMessagesQuery } = messagesApi;
