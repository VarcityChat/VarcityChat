import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { messagesAdapter } from "@/api/chats/chat-api";

const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState({
    chatMessages: {} as Record<string, string[]>, // chatId => messageIds
    loadingStates: {} as Record<string, boolean>,
    lastSync: {} as Record<string, number>,
  }),
  reducers: {
    upsertMessages: messagesAdapter.upsertMany,
    updateMessage: messagesAdapter.updateOne,
    addMessage: messagesAdapter.addOne,
    setMessagesForChat: (
      state,
      action: PayloadAction<{ chatId: string; messageIds: string[] }>
    ) => {
      const { chatId, messageIds } = action.payload;
      state.chatMessages[chatId] = messageIds;
    },
    setLoadingState: (
      state,
      action: PayloadAction<{ chatId: string; loading: boolean }>
    ) => {
      const { chatId, loading } = action.payload;
      state.loadingStates[chatId] = loading;
    },
    updateLastSync: (
      state,
      action: PayloadAction<{ chatId: string; timestamp: number }>
    ) => {
      const { chatId, timestamp } = action.payload;
      state.lastSync[chatId] = timestamp;
    },
  },
});

export default messagesSlice.reducer;
export const {
  upsertMessages,
  updateMessage,
  addMessage,
  setLoadingState,
  updateLastSync,
  setMessagesForChat,
} = messagesSlice.actions;
