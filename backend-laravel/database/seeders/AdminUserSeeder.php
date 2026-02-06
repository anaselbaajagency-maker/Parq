<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@parq.ma'],
            [
                'full_name' => 'Admin Parq',
                'email' => 'admin@parq.ma',
                'password' => Hash::make('Admin@123'),
                'role' => 'admin',
                'phone' => '+212600000000',
            ]
        );
    }
}
