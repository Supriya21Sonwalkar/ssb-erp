<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'role_id' => 1,
            'employee_id' => null, // or an existing employee ID
            'name' => 'Administrator',
            'email' => 'admin@adaerp.com',
            'mobile' => '9999999999',
            'password' => Hash::make('Admin@123'),
            'profile_photo' => null,
            'status' => 1,
        ]);
    }
}