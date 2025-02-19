import { IChat } from "@/api/chats/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  activeChat: {
    chat: IChat;
    receiverId: string;
  } | null;
}

const initialState: SliceState = {
  activeChat: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setActiveChat: (
      state,
      action: PayloadAction<{
        chat: IChat;
        receiverId: string;
      }>
    ) => {
      const { chat, receiverId } = action.payload;
      state.activeChat = { chat: { ...chat }, receiverId };
    },

    resetActiveChat: (state) => {
      state.activeChat = null;
    },
  },
});

export const { setActiveChat, resetActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
