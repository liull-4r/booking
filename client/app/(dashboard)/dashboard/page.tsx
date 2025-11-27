"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useGetRoomsQuery } from "../../../services/roomsService";
import { useGetReservationsQuery } from "../../../services/reservationsService";
import Spinner from "../../components/Spinner";
import Link from "next/link";

export default function UserDashboardPage() {
  return (
    <ProtectedRoute role="user">
      <UserDashboardContent />
    </ProtectedRoute>
  );
}

function UserDashboardContent() {
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRoomsQuery();
  const { data: reservationsData, isLoading: isLoadingReservations } =
    useGetReservationsQuery();
  const rooms = roomsData?.data?.rooms || [];
  const activeRooms = rooms.filter((room) => room.is_active);
  const reservations = reservationsData?.data?.reservations || [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Your Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
          View available rooms and manage your reservations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Available Rooms
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {isLoadingRooms ? "..." : activeRooms.length}
                </p>
              </div>
              <div className="text-4xl">🏨</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  My Reservations
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {isLoadingReservations ? "..." : reservations.length}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/rooms"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔍</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Browse Rooms
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View all available rooms and make a reservation
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/reservations"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  My Reservations
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage your bookings
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
