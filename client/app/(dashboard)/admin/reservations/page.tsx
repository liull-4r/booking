"use client";

import ProtectedRoute from "../../../components/ProtectedRoute";
import Spinner from "../../../components/Spinner";
import { useGetAllReservationsQuery } from "../../../../services/reservationsService";

export default function AdminReservationsPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminReservationsPageContent />
    </ProtectedRoute>
  );
}

function AdminReservationsPageContent() {
  const { data, isLoading } = useGetAllReservationsQuery();
  const reservations = data?.data?.reservations || [];

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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            All Reservations
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            View and manage all reservations in the system
          </p>
        </div>

        {isLoading ? (
          <div className="py-20">
            <Spinner size="md" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No reservations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No bookings have been made yet
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {reservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Room {reservation.room?.room_number}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reservation.room?.beds}{" "}
                            {reservation.room?.beds === 1 ? "Bed" : "Beds"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {reservation.user?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reservation.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDateTime(reservation.start_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDateTime(reservation.end_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {reservation.duration || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {reservation.created_at
                            ? formatDateTime(reservation.created_at)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Room {reservation.room?.room_number}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {reservation.room?.beds}{" "}
                      {reservation.room?.beds === 1 ? "Bed" : "Beds"}
                    </p>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        User
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {reservation.user?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Start Time
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(reservation.start_time)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        End Time
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(reservation.end_time)}
                      </p>
                    </div>

                    {reservation.duration && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Duration
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {reservation.duration}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
