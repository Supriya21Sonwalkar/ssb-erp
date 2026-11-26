<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Admin::updateOrCreate(
            ['email' => 'admin@ada.com'],
            [
                'name' => 'ADA Administrator',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
            ]
        );
    }
}