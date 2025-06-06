import { authStorage } from "@/core/storage";
import { RootState } from "@/core/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// const BASE_URL = "https://varcitychat.onrender.com";
const BASE_URL = "https://95e3-105-113-18-231.ngrok-free.app";
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
  tagTypes: [
    "Universities",
    "Auth",
    "Messages",
    "Chats",
    "Students",
    "Notifications",
  ],
});

export const axiosApiClient = axios.create({
  baseURL: BASE_ENDPOINT,
});

axiosApiClient.interceptors.request.use(async (config) => {
  const authData = await authStorage.getAuthData();
  if (authData) {
    config.headers["Authorization"] = `Bearer ${authData.token}`;
  }
  return config;
});
