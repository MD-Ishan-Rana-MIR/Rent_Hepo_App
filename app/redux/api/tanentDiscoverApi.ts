import { baseApi } from "./baseApi";

export const tanentDiscoverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    discoverProperty: builder.query({
      query: (params) => {
        return {
          url: `/tenant/discover-properties`,
          method: "GET",
          params: {
            search: params?.search,
            location: params?.location,
            purpose: params?.purpose,
            property_category: params?.property_category,
            min_price: params?.min_price,
            max_price: params?.max_price,
            min_area: params?.min_area,
            max_area: params?.max_area,
            lat: params?.lat,
            long: params?.long,
            radius: params?.radius,
          },
        };
      },
      providesTags: ["Discover"],
    }),

    singleTenentProperty: builder.query({
      query: (id) => ({
        url: `/tenant/view-property/${id}`,
        method: "GET",
      }),
      providesTags: ["TanentBooking"],
    }),

    propertyMapBoxDetails: builder.query({
      query: ({ latitude, longitude }) => ({
        url: `/tenant/map-properties?latitude=${latitude}&longitude=${longitude}`,
        method: "GET",
      }),
      providesTags: ["TanentBooking"],
    }),
  }),
});

export const {
  useDiscoverPropertyQuery,
  useSingleTenentPropertyQuery,
  usePropertyMapBoxDetailsQuery,
} = tanentDiscoverApi;
