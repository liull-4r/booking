// Reservation types for the booking system

import type { Room } from "./room";
import type { User } from "./user";

export interface Reservation {
  id: number;
  room_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  duration?: string;
  created_at?: string;
  room?: Room;
  user?: User;
}

export interface ReservationsResponse {
  success: boolean;
  data: {
    reservations: Reservation[];
  };
  message?: string;
  error?: string;
}

export interface ReservationResponse {
  success: boolean;
  data: {
    reservation: Reservation;
  };
  message?: string;
  error?: string;
}

export interface CreateReservationData {
  room_id: number;
  start_time: string;
  end_time: string;
}
