import { baseApi } from "./baseApi";

export const tanentDiscoverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    discoverProperty: builder.query({
      query: () => ({
        url: `/tenant/discover-properties`,
        method: "GET",
      }),
      providesTags: ["Discover"],
    }),
    singleTenentProperty: builder.query({
      query: (id) => ({
        url: `/tenant/view-property/${id}`,
        method: "GET",
      }),
      providesTags: ["TanentBooking"],
    }),
  }),
});

export const { useDiscoverPropertyQuery, useSingleTenentPropertyQuery } =
  tanentDiscoverApi;
