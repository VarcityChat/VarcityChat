import { setAuth, updateUser } from "@/core/auth/auth-slice";
import {
  IForgotPasswordBody,
  IGetSignedUrlResponse,
  ILoginBody,
  ILoginResponse,
  IResetPasswordBody,
  ISignupBody,
  ISignupResponse,
  IUserExistsResponse,
} from "./types";
import { api } from "../api";
import { IUser } from "@/types/user";

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signup: builder.mutation<ISignupResponse, ISignupBody>({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    getSignedUrl: builder.query<IGetSignedUrlResponse, null>({
      query: () => "/get-cloudinary-signed-url",
    }),

    userExists: builder.query<IUserExistsResponse, string>({
      query: (email) => ({
        url: `/user-exists?email=${email}`,
      }),
      keepUnusedDataFor: 0,
    }),

    login: builder.mutation<ILoginResponse, ILoginBody>({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setAuth({
              token: data.token,
              user: data.user,
              isAuthenticated: true,
            })
          );
        } catch (error) {}
      },
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<Response, IForgotPasswordBody>({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    resetPassword: builder.mutation<Response, IResetPasswordBody>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    updateUser: builder.mutation<{ updatedUser: Partial<IUser> }, any>({
      query: (body) => ({
        url: "/user",
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data.updatedUser;
          dispatch(
            updateUser({
              firstname: user?.firstname,
              lastname: user?.lastname,
              about: user?.about,
              images: user?.images,
              lookingFor: user?.lookingFor,
              mobileNumber: user?.mobileNumber,
              relationshipStatus: user?.relationshipStatus,
              course: user?.course,
            } as IUser)
          );
        } catch (error) {}
      },
    }),

    updateUserStatus: builder.mutation<
      { updatedUser: Partial<IUser> },
      Partial<IUser["settings"]>
    >({
      query: (body) => ({
        url: "/user/status",
        method: "PUT",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            updateUser({ settings: { ...data.updatedUser.settings } } as IUser)
          );
        } catch (error) {}
      },
    }),

    updateDeviceToken: builder.mutation<any, { deviceToken: string }>({
      query: (body) => ({
        url: "/user/deviceToken",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSignupMutation,
  useLazyUserExistsQuery,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUpdateDeviceTokenMutation,
} = authApi;
