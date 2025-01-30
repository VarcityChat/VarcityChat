import { RootState } from "@/core/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_ENDPOINT =
  "https://ba39-2c0f-f5c0-b2a-3222-80de-d43-d51e-ed97.ngrok-free.app/api/v1";

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
});
