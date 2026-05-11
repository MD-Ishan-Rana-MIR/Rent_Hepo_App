import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (page = 1) => `get-notifications?page=${page}`,

      transformResponse: (response: any) => {
        return response;
      },

      providesTags: ["Notification"],
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: `/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    singleNotificationRead: builder.mutation({
      query: (id) => ({
        url: `read?notification_id=${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useSingleNotificationReadMutation,
} = notificationApi;
