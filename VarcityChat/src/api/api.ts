import { RootState } from "@/core/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const BASE_ENDPOINT = "https://1b6a-102-89-69-92.ngrok-free.app/api/v1";
export const BASE_SOCKET_ENDPOINT = "https://1b6a-102-89-69-92.ngrok-free.app";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_ENDPOINT,
  prepareHeaders: (headers: Headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    const authToken = (getState() as RootState)?.auth?.token;
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "clientApi",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["Universities", "Auth", "Messages", "Chats"],
});
