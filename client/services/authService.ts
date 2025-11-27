import { api } from "../lib/api";
import type {
  LoginFormData,
  RegisterFormData,
  LoginResponse,
  RegisterResponse,
  MeResponse,
  LogoutResponse,
} from "../types/user";

export const authService = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterFormData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginFormData>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    me: builder.query<MeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
} = authService;
