import { api } from "../api";
import { IUser } from "@/types/user";

export const studentsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getStudent: builder.query<IUser, { userId: string }>({
      query: ({ userId }) => `/user/${userId}`,
      transformResponse: (response: { user: IUser }) => response.user,
      providesTags: (result) =>
        result
          ? [{ type: "Students", id: result._id }]
          : [{ type: "Students", id: "LIST" }],
    }),
  }),
});

export const { useGetStudentQuery } = studentsApi;
