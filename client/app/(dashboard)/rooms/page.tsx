"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReusableModal from "../../components/ReusableModal";
import Spinner from "../../components/Spinner";
import { getRole } from "../../../lib/auth";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "../../../services/roomsService";
import { handleApiError } from "../../../lib/handleApiError";
import type { Room, CreateRoomData, UpdateRoomData } from "../../../types/room";

export default function RoomsPage() {
  return <RoomsPageContent />;
}

function RoomsPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const isAdmin = getRole() === "admin";

  const { data, isLoading, refetch } = useGetRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const rooms = data?.data?.rooms || [];
  const isLoadingData = isLoading || isDeleting;

  const handleOpenModal = (room?: Room) => {
    setSelectedRoom(room || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleSave = async (formData: CreateRoomData | UpdateRoomData) => {
    try {
      if (selectedRoom) {
        await updateRoom({
          id: selectedRoom.id,
          data: formData as UpdateRoomData,
        }).unwrap();
        toast.success("Room updated successfully!");
      } else {
        await createRoom(formData as CreateRoomData).unwrap();
        toast.success("Room created successfully!");
      }
      handleCloseModal();
      refetch();
    } catch (error: any) {
      handleApiError(error, "Failed to save room");
    }
  };

  const handleDelete = async (room: Room) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete room ${room.room_number}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteRoom(room.id).unwrap();
      toast.success("Room deleted successfully!");
      refetch();
    } catch (error: any) {
      handleApiError(error, "Failed to delete room");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isAdmin ? "Rooms Management" : "Available Rooms"}
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {isAdmin
                ? "Manage all available rooms for booking"
                : "Browse and book available rooms"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => handleOpenModal()}
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
              <span className="hidden sm:inline">Add New Room</span>
              <span className="sm:hidden">Add Room</span>
            </button>
          )}
        </div>

        {isLoadingData ? (
          <div className="py-20">
            <Spinner size="md" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No rooms found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isAdmin
                ? "Get started by creating your first room"
                : "No rooms are currently available for booking"}
            </p>
            {isAdmin && (
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold cursor-pointer"
              >
                Create First Room
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 ${
                  !room.is_active
                    ? "opacity-60 border-2 border-gray-300 dark:border-gray-600"
                    : "border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Room {room.room_number}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          room.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {room.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5"
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
                    <span className="font-medium">
                      {room.beds} {room.beds === 1 ? "Bed" : "Beds"}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room)}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        type="room"
        room={selectedRoom}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
