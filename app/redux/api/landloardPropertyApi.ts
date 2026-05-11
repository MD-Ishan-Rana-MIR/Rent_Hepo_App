import { baseApi } from "./baseApi";

export const landloardPropertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allLandloardProperty: builder.query({
      query: () => ({
        url: "/landlord/get-properties",
        method: "GET",
      }),
      providesTags: ["LandLoardProperty"],
    }),
    singleLandloardPropertyDetails: builder.query({
      query: (id) => ({
        url: `/landlord/view-property/${id}`,
        method: "GET",
      }),
    }),
    propertyDelete: builder.mutation({
      query: (id) => ({
        url: `/landlord/delete-property/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LandLoardProperty"],
    }),
    landLoardPropertyUpdate: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/landlord/edit-property/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["LandLoardProperty"],
    }),
  }),
});

export const {
  useAllLandloardPropertyQuery,
  useSingleLandloardPropertyDetailsQuery,
  usePropertyDeleteMutation,
  useLandLoardPropertyUpdateMutation,
} = landloardPropertyApi;
