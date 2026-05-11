import { baseApi } from "./baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findPropertyByAi: builder.mutation({
      query: (trimmedText) => {
        return {
          url: `/ai-search?message=${encodeURIComponent(trimmedText)}`,
          method: "POST",
        };
      },
      invalidatesTags: ["Ai"],
    }),
  }),
});

export const { useFindPropertyByAiMutation } = aiApi;
