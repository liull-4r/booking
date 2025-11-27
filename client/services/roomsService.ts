import { api } from "../lib/api";
import type {
  RoomsResponse,
  RoomResponse,
  CreateRoomData,
  UpdateRoomData,
} from "../types/room";

export const roomsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<RoomsResponse, void>({
      query: () => "/rooms",
      providesTags: ["Room"],
    }),

    createRoom: builder.mutation<RoomResponse, CreateRoomData>({
      query: (data) => ({
        url: "/rooms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),

    updateRoom: builder.mutation<
      RoomResponse,
      { id: number; data: UpdateRoomData }
    >({
      query: ({ id, data }) => ({
        url: `/rooms/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Room", id },
        "Room",
      ],
    }),

    deleteRoom: builder.mutation<{ success: boolean; message: string }, number>(
      {
        query: (id) => ({
          url: `/rooms/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Room"],
      }
    ),
  }),
});

export const {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsService;
