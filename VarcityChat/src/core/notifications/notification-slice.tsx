import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    hasNotification: false,
  },
  reducers: {
    setHasNotification: (state, action: PayloadAction<boolean>) => {
      state.hasNotification = action.payload;
    },
  },
});

export const { setHasNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
