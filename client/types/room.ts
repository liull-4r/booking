// Room types for the booking system

export interface Room {
  id: number;
  room_number: string;
  beds: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoomsResponse {
  success: boolean;
  data: {
    rooms: Room[];
  };
  message?: string;
  error?: string;
}

export interface RoomResponse {
  success: boolean;
  data: {
    room: Room;
  };
  message?: string;
  error?: string;
}

export interface CreateRoomData {
  room_number: string;
  beds: number;
  is_active?: boolean;
}

export interface UpdateRoomData {
  room_number?: string;
  beds?: number;
  is_active?: boolean;
}
