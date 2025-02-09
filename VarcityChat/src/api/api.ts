import { RootState } from "@/core/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  "https://c1a4-2c0f-f5c0-b24-161c-8da0-b844-20bb-8b70.ngrok-free.app";
export const BASE_ENDPOINT = `${BASE_URL}/api/v1`;
export const BASE_SOCKET_ENDPOINT = BASE_URL;

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
