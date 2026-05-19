import { baseApi } from "./baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findPropertyByAi: builder.mutation({
      query: (trimmedText) => {
        return {
          url: `/tenant/ai-assistant?message=${encodeURIComponent(trimmedText)}`,
          method: "POST",
        };
      },
      invalidatesTags: ["Ai"],
    }),
    getAllCurrencies: builder.query({
      query: () => ({
        url: "/get-currencies",
        method: "GET",
      }),
      // providesTags: ["Currency"],
    }),
  }),
});

export const { useFindPropertyByAiMutation, useGetAllCurrenciesQuery } = aiApi;
