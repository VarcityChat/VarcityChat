import { IChat, IChatUser } from "@/api/chats/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  activeChat: {
    chat: IChat;
    receiver: IChatUser;
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
        receiver: IChatUser;
      }>
    ) => {
      state.activeChat = action.payload;
    },

    resetActiveChat: (state) => {
      state.activeChat = null;
    },
  },
});

export const { setActiveChat, resetActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
