import { ISignupBody } from "@/api/auth/types";
import { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  token: string | null;
  user: IUser | null;
  signupData: ISignupBody | null;
}

const initialState: SliceState = {
  token: null,
  user: null,
  signupData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: IUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setSignupData: (state, action: PayloadAction<ISignupBody>) => {
      state.signupData = { ...state.signupData, ...action.payload };
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuth, setSignupData, logout } = authSlice.actions;

export default authSlice.reducer;
