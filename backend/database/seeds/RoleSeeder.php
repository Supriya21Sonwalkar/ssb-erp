<?php

 

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            ['name' => 'Super Admin', 'guard' => 'admin'],
            ['name' => 'Admin', 'guard' => 'admin'],
            ['name' => 'Principal', 'guard' => 'admin'],
            ['name' => 'Vice Principal', 'guard' => 'admin'],
            ['name' => 'Teacher', 'guard' => 'admin'],
            ['name' => 'Accountant', 'guard' => 'admin'],
            ['name' => 'Receptionist', 'guard' => 'admin'],
            ['name' => 'Librarian', 'guard' => 'admin'],
            ['name' => 'Transport Manager', 'guard' => 'admin'],
            ['name' => 'HR', 'guard' => 'admin'],
            ['name' => 'Student', 'guard' => 'web'],
        ];

        foreach ($roles as $role) {
            Role::findOrCreate($role['name'], $role['guard']);
        }

        if (class_exists(\App\Models\Role::class)) {
            \App\Models\Role::firstOrCreate(
                ['name' => 'Student', 'guard_name' => 'web']
            );
        }
    }
}