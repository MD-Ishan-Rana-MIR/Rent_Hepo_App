import { baseApi } from "./baseApi";

export const tanentBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaticPage: builder.query({
      query: (page_name) => ({
        url: `/pages/${page_name}`,
        method: "GET",
      }),
      providesTags: ["Static"],
    }),
  }),
});

export const { useGetStaticPageQuery } = tanentBookingApi;
