import { INotification } from "./types";
import { api } from "../api";

export const notificationsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.query<INotification[], null>({
      query: () => `/notifications`,
      transformResponse: (response: { notifications: INotification[] }) =>
        response.notifications,
      keepUnusedDataFor: 60 * 60 * 5,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Notifications" as const,
                _id,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
