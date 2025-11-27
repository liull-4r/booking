"use client";

import { useEffect, useState } from "react";
import FormModal from "./FormModal";
import Input from "./Input";
import type { CreateRoomData, UpdateRoomData } from "../../types/room";
import type { CreateReservationData } from "../../types/reservation";
import type { Room } from "../../types/room";
import { roomSchema, reservationSchema } from "../../lib/validation";
import * as yup from "yup";

type ModalType = "room" | "reservation";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: ModalType;
  room?: Room | null;
  rooms?: Room[];
  isLoading?: boolean;
}

export default function ReusableModal({
  isOpen,
  onClose,
  onSave,
  type,
  room,
  rooms = [],
  isLoading = false,
}: ReusableModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      if (type === "room") {
        setFormData({
          room_number: room?.room_number || "",
          beds: room?.beds || 1,
          is_active: room?.is_active ?? true,
        });
      } else if (type === "reservation") {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const formatDateTime = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        setFormData({
          room_id: "",
          start_time: formatDateTime(now),
          end_time: formatDateTime(oneHourLater),
        });
      }
      setErrors({});
      setTouched({});
    } else {
      setFormData({});
      setErrors({});
      setTouched({});
    }
  }, [isOpen, type, room]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value) || ""
          : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched({
      ...touched,
      [fieldName]: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const schema = type === "room" ? roomSchema : reservationSchema;
      await schema.validate(formData, { abortEarly: false });

      let dataToSave: any;
      if (type === "room") {
        dataToSave = {
          room_number: formData.room_number,
          beds: parseInt(formData.beds),
          is_active: formData.is_active ?? true,
        };
      } else {
        dataToSave = {
          room_id: parseInt(formData.room_id),
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
        };
      }

      onSave(dataToSave);
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
        const touchedFields: Record<string, boolean> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            touchedFields[error.path] = true;
          }
        });
        setTouched(touchedFields);
      }
    }
  };

  const getTitle = () => {
    if (type === "room") {
      return room ? "Edit Room" : "Create New Room";
    }
    return "Create Reservation";
  };

  const getSubmitLabel = () => {
    if (type === "room") {
      return room ? "Update Room" : "Create Room";
    }
    return "Book Room";
  };

  const activeRooms = rooms.filter((room) => room.is_active);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      isLoading={isLoading}
      submitLabel={getSubmitLabel()}
      onSubmit={handleSubmit}
    >
      {type === "room" ? (
        <>
          <Input
            label="Room Number"
            type="text"
            id="room_number"
            name="room_number"
            value={formData.room_number || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("room_number")}
            placeholder="e.g., 101, 202A"
            error={touched.room_number ? errors.room_number : ""}
          />

          <Input
            label="Number of Beds"
            type="number"
            id="beds"
            name="beds"
            value={formData.beds || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("beds")}
            min="1"
            error={touched.beds ? errors.beds : ""}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active ?? true}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Room is active (available for booking)
            </label>
          </div>
        </>
      ) : (
        <>
          <div>
            <label
              htmlFor="room_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Room
            </label>
            <select
              id="room_id"
              name="room_id"
              value={formData.room_id || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("room_id")}
              className={`w-full px-4 py-3 border ${
                touched.room_id && errors.room_id
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all cursor-pointer`}
            >
              <option value="">Choose a room...</option>
              {activeRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number} - {room.beds}{" "}
                  {room.beds === 1 ? "Bed" : "Beds"}
                </option>
              ))}
            </select>
            {touched.room_id && errors.room_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.room_id}
              </p>
            )}
            {activeRooms.length === 0 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                No active rooms available
              </p>
            )}
          </div>

          <Input
            label="Start Time"
            type="datetime-local"
            id="start_time"
            name="start_time"
            value={formData.start_time || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("start_time")}
            error={touched.start_time ? errors.start_time : ""}
          />

          <Input
            label="End Time"
            type="datetime-local"
            id="end_time"
            name="end_time"
            value={formData.end_time || ""}
            onChange={handleChange}
            onBlur={() => handleBlur("end_time")}
            min={formData.start_time || ""}
            error={touched.end_time ? errors.end_time : ""}
          />
        </>
      )}
    </FormModal>
  );
}
