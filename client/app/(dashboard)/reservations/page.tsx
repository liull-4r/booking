"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ProtectedRoute from "../../components/ProtectedRoute";
import ReusableModal from "../../components/ReusableModal";
import Spinner from "../../components/Spinner";
import {
  useGetReservationsQuery,
  useCreateReservationMutation,
} from "../../../services/reservationsService";
import { useGetRoomsQuery } from "../../../services/roomsService";
import { handleApiError } from "../../../lib/handleApiError";
import type { CreateReservationData } from "../../../types/reservation";

export default function ReservationsPage() {
  return (
    <ProtectedRoute role="user">
      <ReservationsPageContent />
    </ProtectedRoute>
  );
}

function ReservationsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetReservationsQuery();
  const { data: roomsData } = useGetRoomsQuery();
  const [createReservation, { isLoading: isCreating }] =
    useCreateReservationMutation();

  const reservations = data?.data?.reservations || [];
  const rooms = roomsData?.data?.rooms || [];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (formData: CreateReservationData) => {
    try {
      await createReservation(formData).unwrap();
      toast.success("Reservation created successfully!");
      handleCloseModal();
      refetch();
    } catch (error: any) {
      handleApiError(error, "Failed to create reservation");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Reservations
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              View and manage your bookings
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 md:px-6 py-2 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Book a Room</span>
            <span className="sm:hidden">Book</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20">
            <Spinner size="md" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No reservations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by booking your first room
            </p>
            <button
              onClick={handleOpenModal}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold cursor-pointer"
            >
              Book Your First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Room {reservation.room?.room_number}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>
                      {reservation.room?.beds}{" "}
                      {reservation.room?.beds === 1 ? "Bed" : "Beds"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateTime(reservation.start_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        End
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateTime(reservation.end_time)}
                      </p>
                    </div>
                  </div>

                  {reservation.duration && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Duration: {reservation.duration}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        type="reservation"
        rooms={rooms}
        isLoading={isCreating}
      />
    </div>
  );
}
