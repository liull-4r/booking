import { api } from "../lib/api";
import type {
  ReservationsResponse,
  ReservationResponse,
  CreateReservationData,
} from "../types/reservation";

export const reservationsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getReservations: builder.query<ReservationsResponse, void>({
      query: () => "/reservations",
      providesTags: ["Reservation"],
    }),

    createReservation: builder.mutation<
      ReservationResponse,
      CreateReservationData
    >({
      query: (data) => ({
        url: "/reservations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reservation"],
    }),

    getAllReservations: builder.query<ReservationsResponse, void>({
      query: () => "/admin/reservations",
      providesTags: ["Reservation"],
    }),

    getStatistics: builder.query<
      {
        success: boolean;
        data: {
          daily_reservations: Array<{
            date: string;
            label: string;
            count: number;
          }>;
          room_reservations: Array<{
            room_id: number;
            room_number: string;
            count: number;
          }>;
        };
      },
      void
    >({
      query: () => "/admin/statistics",
      providesTags: ["Reservation"],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useCreateReservationMutation,
  useGetAllReservationsQuery,
  useGetStatisticsQuery,
} = reservationsService;
