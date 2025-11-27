import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = typeof window !== "undefined" ? Cookies.get("token") : null;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      return headers;
    },
  }),
  tagTypes: ["User", "Room", "Reservation"],
  endpoints: () => ({}),
});
