import { IUniversity } from "./types";
import { api } from "../api";
import { IUser } from "@/types/user";
import { IPaginatedData, IPaginatedPayload } from "@/types";
import { current } from "@reduxjs/toolkit";

export const universityApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUniversities: builder.query<IUniversity[], null>({
      query: () => `/unis`,
      transformResponse: (response: { unis: IUniversity[] }) => response.unis,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Universities" as const,
                _id,
              })),
              { type: "Universities", id: "LIST" },
            ]
          : [{ type: "Universities", id: "LIST" }],
    }),

    getUniversityStudentsPaginated: builder.query<
      IPaginatedData<IUser>,
      IPaginatedPayload & { uniId: string }
    >({
      query: ({ page = 1, limit = 30, uniId }) => {
        return `/uni/${uniId}/students?page=${page}&limit=${limit}`;
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCacheData, newData) => {
        if (newData.currentPage === 1) {
          return newData;
        }
        currentCacheData.data = [...currentCacheData.data, ...newData.data];
        currentCacheData.currentPage = newData.currentPage;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      transformResponse: (response: {
        users: IUser[];
        total: number;
        currentPage: number;
        totalPages: number;
      }) => {
        return {
          data: response.users,
          total: response.total,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetUniversitiesQuery,
  // useGetUniversityStudentsPaginatedQuery,
} = universityApi;
