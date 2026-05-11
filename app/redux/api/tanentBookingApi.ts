import { baseApi } from "./baseApi";

export const tanentBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    tanentAllBooking: builder.query({
      query: () => ({
        url: `/tenant/get-booking-histories`,
        method: "GET",
      }),
      providesTags: ["TanentBooking"],
    }),
    tanentBookingDelete: builder.mutation({
      query: (id) => ({
        url: `/tenant/delete-booking-history/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TanentBooking"],
    }),
    propertyBooking: builder.mutation({
      query: (payloa) => ({
        url: `/tenant/book-now`,
        method: "POST",
        body: payloa,
      }),
      invalidatesTags: ["TanentBooking"],
    }),
  }),
});

export const {
  useTanentAllBookingQuery,
  useTanentBookingDeleteMutation,
  usePropertyBookingMutation,
} = tanentBookingApi;
