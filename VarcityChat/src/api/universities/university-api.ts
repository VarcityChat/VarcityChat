import { IUniversity } from "./types";
import { api } from "../api";

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
  }),
});

export const { useGetUniversitiesQuery } = universityApi;
