<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Room;
use App\Models\Reservation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $user = User::create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $activeRoom1 = Room::create([
            'room_number' => '101',
            'beds' => 2,
            'is_active' => true,
        ]);

        $activeRoom2 = Room::create([
            'room_number' => '102',
            'beds' => 1,
            'is_active' => true,
        ]);

        $inactiveRoom1 = Room::create([
            'room_number' => '201',
            'beds' => 3,
            'is_active' => false,
        ]);

        $inactiveRoom2 = Room::create([
            'room_number' => '202',
            'beds' => 2,
            'is_active' => false,
        ]);

        $tomorrow = Carbon::tomorrow()->setTime(10, 0, 0);
        $dayAfterTomorrow = Carbon::tomorrow()->addDay()->setTime(14, 0, 0);

        Reservation::create([
            'user_id' => $user->id,
            'room_id' => $activeRoom1->id,
            'start_time' => $tomorrow,
            'end_time' => $dayAfterTomorrow,
        ]);
    }
}
