import { ISignupBody } from "@/api/auth/types";
import { IUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authStorage } from "../storage";

interface SliceState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  signupData: ISignupBody | null;
  showSuccessModal: boolean;
}

const initialState: SliceState = {
  token: null,
  user: null,
  isAuthenticated: false,
  signupData: null,
  showSuccessModal: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token?: string;
        user?: IUser;
        isAuthenticated?: boolean;
      }>
    ) => {
      const { token, user, isAuthenticated } = action.payload;
      if (token) state.token = token;
      if (user) state.user = user;
      if (isAuthenticated) state.isAuthenticated = isAuthenticated;

      if (state.token && state.user && state.isAuthenticated) {
        authStorage.storeAuthData(
          state.token,
          state.user,
          state.isAuthenticated
        );
      }
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...action.payload };
      if (state.user && state.token) {
        authStorage.storeAuthData(
          state.token,
          state.user,
          state.isAuthenticated
        );
      }
    },
    setSignupData: (state, action: PayloadAction<ISignupBody>) => {
      state.signupData = { ...state.signupData, ...action.payload };
    },
    setShowSuccessModal: (state, action: PayloadAction<boolean>) => {
      state.showSuccessModal = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      authStorage.removeAuthData();
    },
  },
});

export const {
  setAuth,
  updateUser,
  setSignupData,
  setShowSuccessModal,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
