import { RootState } from "@/core/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_ENDPOINT =
  "https://60f0-2c0f-f5c0-b04-2e91-787a-6e01-59f5-9157.ngrok-free.app/api/v1";

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
  tagTypes: ["Universities"],
});
