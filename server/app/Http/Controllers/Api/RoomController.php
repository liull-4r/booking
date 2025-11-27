<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Room\StoreRoomRequest;
use App\Http\Requests\Room\UpdateRoomRequest;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = auth('api')->user();

            if ($user->role === 'admin') {
                $rooms = Room::all();
            } else {
                $rooms = Room::where('is_active', true)->get();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'rooms' => $rooms,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rooms.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function store(StoreRoomRequest $request)
    {
        try {
            $room = Room::create([
                'room_number' => $request->room_number,
                'beds' => $request->beds,
                'is_active' => $request->is_active ?? true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'data' => [
                    'room' => $room,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create room.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function update(UpdateRoomRequest $request, Room $room)
    {
        try {
            if ($request->has('room_number')) {
                $room->room_number = $request->room_number;
            }
            if ($request->has('beds')) {
                $room->beds = $request->beds;
            }
            if ($request->has('is_active')) {
                $room->is_active = $request->is_active;
            }

            $room->save();

            return response()->json([
                'success' => true,
                'message' => 'Room updated successfully',
                'data' => [
                    'room' => $room,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update room.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function destroy(Room $room)
    {
        try {
            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Room deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
