"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useGetRoomsQuery } from "../../../services/roomsService";
import {
  useGetAllReservationsQuery,
  useGetStatisticsQuery,
} from "../../../services/reservationsService";
import Spinner from "../../components/Spinner";
import Link from "next/link";
import DonutChart from "../../components/DonutChart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
  const { data: statisticsData, isLoading: isLoadingStatistics } =
    useGetStatisticsQuery();
  const rooms = roomsData?.data?.rooms || [];
  const activeRooms = rooms.filter((room) => room.is_active);
  const inactiveRooms = rooms.filter((room) => !room.is_active);
  const reservations = reservationsData?.data?.reservations || [];

  const roomChartData =
    rooms.length === 0
      ? []
      : [
          { name: "Active Rooms", value: activeRooms.length, color: "#10b981" },
          {
            name: "Inactive Rooms",
            value: inactiveRooms.length,
            color: "#ef4444",
          },
        ].filter((item) => item.value > 0);

  const reservationChartData = statisticsData?.data?.daily_reservations || [];
  const roomReservationData = statisticsData?.data?.room_reservations || [];

  const colorPalette = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#a855f7",
    "#14b8a6",
    "#f97316",
  ];

  const roomReservationChartData = roomReservationData.map((room, index) => ({
    name: `Room ${room.room_number}`,
    value: room.count,
    color: colorPalette[index % colorPalette.length],
  }));

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <DonutChart
              data={roomChartData}
              title="Rooms Status"
              isLoading={isLoadingRooms}
              emptyMessage="No rooms found"
              showLegend={false}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <DonutChart
              data={roomReservationChartData}
              title="Top Rooms by Reservations"
              isLoading={isLoadingStatistics}
              emptyMessage="No reservations yet"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Reservations (Last 7 Days)
            </h2>
            {isLoadingStatistics ? (
              <div className="flex items-center justify-center h-64">
                <Spinner size="md" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reservationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366f1" name="Reservations" />
                </BarChart>
              </ResponsiveContainer>
            )}
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
