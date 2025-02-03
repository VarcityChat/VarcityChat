import { ISignupBody, ISignupResponse } from "@/api/auth/types";
import { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  token: string | null;
  user: IUser | null;
  signupData: ISignupBody | null;
  signupResponseDraft: { token: string; user: IUser | null };
  showSuccessModal: boolean;
}

const initialState: SliceState = {
  token: null,
  user: null,
  signupData: null,
  signupResponseDraft: { token: "", user: null },
  showSuccessModal: false,
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
    setSignupResponseDraft: (state, action: PayloadAction<ISignupResponse>) => {
      state.signupResponseDraft = { ...action.payload };
    },
    setShowSuccessModal: (state, action: PayloadAction<boolean>) => {
      state.showSuccessModal = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.signupResponseDraft = { token: "", user: null };
    },
  },
});

export const {
  setAuth,
  setSignupData,
  setSignupResponseDraft,
  setShowSuccessModal,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
