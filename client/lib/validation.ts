import * as yup from "yup";
import type { LoginFormData, RegisterFormData } from "../types/user";
import type { CreateRoomData, UpdateRoomData } from "../types/room";
import type { CreateReservationData } from "../types/reservation";

export const loginSchema = yup.object<LoginFormData>().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = yup.object<RegisterFormData>().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const roomSchema = yup.object<CreateRoomData>().shape({
  room_number: yup
    .string()
    .min(1, "Room number is required")
    .required("Room number is required"),
  beds: yup
    .number()
    .min(1, "Number of beds must be at least 1")
    .required("Number of beds is required")
    .typeError("Number of beds must be a valid number"),
  is_active: yup.boolean().optional(),
});

export const reservationSchema = yup.object<CreateReservationData>().shape({
  room_id: yup
    .number()
    .min(1, "Please select a room")
    .required("Room selection is required")
    .typeError("Please select a room"),
  start_time: yup
    .string()
    .required("Start time is required")
    .test("future-date", "Start time must be in the future", function (value) {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  end_time: yup
    .string()
    .required("End time is required")
    .test("after-start", "End time must be after start time", function (value) {
      const startTime = this.parent.start_time;
      if (!value || !startTime) return false;
      return new Date(value) > new Date(startTime);
    }),
});
