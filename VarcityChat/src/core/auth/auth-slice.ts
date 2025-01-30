import { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  token: string | null;
  user: IUser | null;
}

const initialState: SliceState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: IUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
