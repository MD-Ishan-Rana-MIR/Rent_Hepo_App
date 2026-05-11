import { baseApi } from "./baseApi";

export const landloardBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    landLoardAllBooking: builder.query({
      query: () => ({
        url: `/landlord/get-bookings`,
        method: "GET",
      }),
      providesTags: ["LandLoardBooking"],
    }),
    bookingReject: builder.mutation({
      query: (id) => ({
        url: `/landlord/reject-booking/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["LandLoardBooking"],
    }),
    tanentPropertyPost: builder.mutation({
      query: (finalData) => ({
        url: `/landlord/add-property`,
        method: "POST",
        body: finalData,
      }),
      invalidatesTags: ["LandLoardProperty"],
    }),
    bookingAccept: builder.mutation({
      query: (id) => ({
        url: `/landlord/accept-booking/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["LandLoardBooking"],
    }),
    // accedp
  }),
});

export const {
  useLandLoardAllBookingQuery,
  useBookingRejectMutation,
  useTanentPropertyPostMutation,
  useBookingAcceptMutation,
} = landloardBookingApi;
