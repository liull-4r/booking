"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useGetRoomsQuery } from "../../../services/roomsService";
import { useGetAllReservationsQuery } from "../../../services/reservationsService";
import Spinner from "../../components/Spinner";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRoomsQuery();
  const { data: reservationsData, isLoading: isLoadingReservations } =
    useGetAllReservationsQuery();
  const rooms = roomsData?.data?.rooms || [];
  const activeRooms = rooms.filter((room) => room.is_active);
  const inactiveRooms = rooms.filter((room) => !room.is_active);
  const reservations = reservationsData?.data?.reservations || [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
          Manage rooms, reservations, and system overview
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Rooms
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {isLoadingRooms ? "..." : rooms.length}
                </p>
              </div>
              <div className="text-4xl">🏨</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Active Rooms
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {isLoadingRooms ? "..." : activeRooms.length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Inactive Rooms
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                  {isLoadingRooms ? "..." : inactiveRooms.length}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  All Reservations
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {isLoadingReservations ? "..." : reservations.length}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/rooms"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🛠️</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Manage Rooms
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create, edit, and delete rooms
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/reservations"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  All Reservations
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage all bookings
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/rooms"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">👁️</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  View Rooms
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse all available rooms
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
