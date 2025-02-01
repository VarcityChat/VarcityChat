import { setAuth } from "@/core/auth/auth-slice";
import {
  IForgotPasswordBody,
  ILoginBody,
  ILoginResponse,
  IResetPasswordBody,
} from "./types";
import { api } from "../api";

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginBody>({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth({ token: data.token, user: data.user }));
        } catch (error) {}
      },
    }),

    forgotPassword: builder.mutation<Response, IForgotPasswordBody>({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<Response, IResetPasswordBody>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
