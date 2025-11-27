<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = auth('api')->user();

            $reservations = Reservation::where('user_id', $user->id)
                ->with(['room:id,room_number,beds,is_active'])
                ->orderBy('start_time', 'desc')
                ->get();

            $formattedReservations = $reservations->map(function ($reservation) {
                $startTime = Carbon::parse($reservation->start_time);
                $endTime = Carbon::parse($reservation->end_time);
                
                $diff = $startTime->diff($endTime);
                $days = $diff->days;
                $hours = $diff->h;
                $minutes = $diff->i;
                
                if ($days > 0) {
                    $duration = $days . ' ' . ($days === 1 ? 'day' : 'days');
                    if ($hours > 0) {
                        $duration .= ', ' . $hours . ' ' . ($hours === 1 ? 'hour' : 'hours');
                    }
                } elseif ($hours > 0) {
                    $duration = $hours . ' ' . ($hours === 1 ? 'hour' : 'hours');
                    if ($minutes > 0) {
                        $duration .= ', ' . $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes');
                    }
                } else {
                    $duration = $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes');
                }

                return [
                    'id' => $reservation->id,
                    'room' => [
                        'id' => $reservation->room->id,
                        'room_number' => $reservation->room->room_number,
                        'beds' => $reservation->room->beds,
                        'is_active' => $reservation->room->is_active,
                    ],
                    'start_time' => $reservation->start_time,
                    'end_time' => $reservation->end_time,
                    'duration' => $duration,
                    'created_at' => $reservation->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'reservations' => $formattedReservations,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve reservations.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function store(StoreReservationRequest $request)
    {
        try {
            $user = auth('api')->user();

            $room = Room::findOrFail($request->room_id);
            
            if (!$room->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'This room is not available for booking.',
                ], 400);
            }

            $startTime = Carbon::parse($request->start_time);
            $endTime = Carbon::parse($request->end_time);

            $overlappingReservation = Reservation::where('room_id', $request->room_id)
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                          ->where('end_time', '>', $startTime);
                    })->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<', $endTime)
                          ->where('end_time', '>=', $endTime);
                    })->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '>=', $startTime)
                          ->where('end_time', '<=', $endTime);
                    })->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                          ->where('end_time', '>=', $endTime);
                    });
                })
                ->first();

            if ($overlappingReservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'This room is already booked for the selected time period. Please choose a different time or room.',
                ], 409);
            }

            $reservation = Reservation::create([
                'user_id' => $user->id,
                'room_id' => $request->room_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
            ]);

            $reservation->load(['room:id,room_number,beds,is_active', 'user:id,name,email']);

            $diff = $startTime->diff($endTime);
            $days = $diff->days;
            $hours = $diff->h;
            $minutes = $diff->i;
            
            if ($days > 0) {
                $duration = $days . ' ' . ($days === 1 ? 'day' : 'days');
                if ($hours > 0) {
                    $duration .= ', ' . $hours . ' ' . ($hours === 1 ? 'hour' : 'hours');
                }
            } elseif ($hours > 0) {
                $duration = $hours . ' ' . ($hours === 1 ? 'hour' : 'hours');
                if ($minutes > 0) {
                    $duration .= ', ' . $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes');
                }
            } else {
                $duration = $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes');
            }

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'data' => [
                    'reservation' => [
                        'id' => $reservation->id,
                        'room' => [
                            'id' => $reservation->room->id,
                            'room_number' => $reservation->room->room_number,
                            'beds' => $reservation->room->beds,
                        ],
                        'start_time' => $reservation->start_time,
                        'end_time' => $reservation->end_time,
                        'duration' => $duration,
                        'created_at' => $reservation->created_at,
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function adminIndex(Request $request)
    {
        try {
            $reservations = Reservation::with([
                'room:id,room_number,beds,is_active',
                'user:id,name,email,role'
            ])
            ->orderBy('start_time', 'desc')
            ->get();

            $formattedReservations = $reservations->map(function ($reservation) {
                $startTime = Carbon::parse($reservation->start_time);
                $endTime = Carbon::parse($reservation->end_time);
                
                $diff = $startTime->diff($endTime);
                $days = $diff->days;
                $hours = $diff->h;
                $minutes = $diff->i;
                
                if ($days > 0) {
                    $duration = $days . ' ' . ($days === 1 ? 'day' : 'days');
                    if ($hours > 0) {
                        $duration .= ', ' . $hours . ' ' . ($hours === 1 ? 'hour' : 'hours');
                    }
                } elseif ($hours > 0) {
                    $duration = $hours . ' ' . ($hours === 1 ? 'hour' : 'hours');
                    if ($minutes > 0) {
                        $duration .= ', ' . $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes');
                    }
                } else {
                    $duration = $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes');
                }

                return [
                    'id' => $reservation->id,
                    'room' => [
                        'id' => $reservation->room->id,
                        'room_number' => $reservation->room->room_number,
                        'beds' => $reservation->room->beds,
                        'is_active' => $reservation->room->is_active,
                    ],
                    'user' => [
                        'id' => $reservation->user->id,
                        'name' => $reservation->user->name,
                        'email' => $reservation->user->email,
                        'role' => $reservation->user->role,
                    ],
                    'start_time' => $reservation->start_time,
                    'end_time' => $reservation->end_time,
                    'duration' => $duration,
                    'created_at' => $reservation->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'reservations' => $formattedReservations,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve reservations.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function statistics(Request $request)
    {
        try {
            $sevenDaysAgo = Carbon::now()->subDays(7)->startOfDay();
            $today = Carbon::now()->endOfDay();

            $reservations = Reservation::whereBetween('created_at', [$sevenDaysAgo, $today])
                ->get();

            $dailyStats = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->startOfDay();
                $dateKey = $date->format('Y-m-d');
                $dateLabel = $date->format('M d');

                $count = $reservations->filter(function ($reservation) use ($date) {
                    return Carbon::parse($reservation->created_at)->isSameDay($date);
                })->count();

                $dailyStats[] = [
                    'date' => $dateKey,
                    'label' => $dateLabel,
                    'count' => $count,
                ];
            }

            $allReservations = Reservation::with('room:id,room_number')
                ->get();

            $roomStats = $allReservations->groupBy('room_id')->map(function ($roomReservations, $roomId) {
                $firstReservation = $roomReservations->first();
                $room = $firstReservation->room ?? null;
                return [
                    'room_id' => (int)$roomId,
                    'room_number' => $room ? $room->room_number : 'Unknown',
                    'count' => $roomReservations->count(),
                ];
            })->values()->sortByDesc('count')->take(10)->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'daily_reservations' => $dailyStats,
                    'room_reservations' => $roomStats,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
