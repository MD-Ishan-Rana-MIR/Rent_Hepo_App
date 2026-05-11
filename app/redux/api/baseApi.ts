import { baseUrl } from "@/lib/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/`,
    prepareHeaders: async (headers, { getState }) => {
      const token = await AsyncStorage.getItem("token");
      const landloardToken = await AsyncStorage.getItem("land-loard-token");
      const forgetToken = await AsyncStorage.getItem("f-token");

      if (token) {
        return headers.set("Authorization", `Bearer ${token}`);
      } else if (landloardToken) {
        return headers.set("Authorization", `Bearer ${landloardToken}`);
      } else if (forgetToken) {
        return headers.set("Authorization", `Bearer ${forgetToken}`);
      }

      headers.set("Accept", "application/json");

      return headers;
    },
  }),

  tagTypes: [
    "Auth",
    "User",
    "TanentBooking",
    "Discover",
    "LandLoardBooking",
    "LandLoardProperty",
    "Notification",
    "Ai",
    "Static",
  ],
  endpoints: () => ({}),
});
