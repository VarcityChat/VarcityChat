import { setAuth } from "@/core/auth/auth-slice";
import { ILoginCredentials, ILoginResponse } from "@/types/user";
import { api } from "./api";

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginCredentials>({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth({ token: data.token, user: data.user }));
        } catch (error) {}
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
