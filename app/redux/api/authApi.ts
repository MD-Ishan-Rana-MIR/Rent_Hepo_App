import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    tanentLogin: builder.mutation({
      query: (data) => ({
        url: `/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userProfile: builder.query({
      query: () => ({
        url: `/get-profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    userLogout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    profileUpdate: builder.mutation({
      query: (formData) => ({
        url: `/personalization`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `/update-password`,
        method: "POST",
        body: payload,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (payload) => ({
        url: `/forgot-password`,
        method: "POST",
        body: payload,
      }),
    }),
    otpVerify: builder.mutation({
      query: (payload) => ({
        url: `/verify-otp`,
        method: "POST",
        body: payload,
      }),
    }),
    passwordChange: builder.mutation({
      query: (data) => ({
        url: `/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    landLoardRegistration: builder.mutation({
      query: (payload) => ({
        url: `/register`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: `/delete-account`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useTanentLoginMutation,
  useUserProfileQuery,
  useUserLogoutMutation,
  useProfileUpdateMutation,
  useUpdatePasswordMutation,
  useForgetPasswordMutation,
  useOtpVerifyMutation,
  usePasswordChangeMutation,
  useLandLoardRegistrationMutation,
  useDeleteAccountMutation,
} = authApi;
