<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Student Management - Students
            ['name' => 'view students'],
            ['name' => 'create students'],
            ['name' => 'edit students'],
            ['name' => 'delete students'],
            ['name' => 'view inactive students'],
            ['name' => 'import students'],
            ['name' => 'export students'],

            // Academic Management
            ['name' => 'view academic years'],
            ['name' => 'create academic years'],
            ['name' => 'edit academic years'],
            ['name' => 'delete academic years'],

            ['name' => 'view classes'],
            ['name' => 'create classes'],
            ['name' => 'edit classes'],
            ['name' => 'delete classes'],

            ['name' => 'view sections'],
            ['name' => 'create sections'],
            ['name' => 'edit sections'],
            ['name' => 'delete sections'],

            ['name' => 'view subjects'],
            ['name' => 'create subjects'],
            ['name' => 'edit subjects'],
            ['name' => 'delete subjects'],

            ['name' => 'view class subjects'],
            ['name' => 'create class subjects'],
            ['name' => 'edit class subjects'],
            ['name' => 'delete class subjects'],

            ['name' => 'view teacher allocations'],
            ['name' => 'create teacher allocations'],
            ['name' => 'edit teacher allocations'],
            ['name' => 'delete teacher allocations'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                [
                    'name' => $permission['name'],
                    'guard_name' => 'web',
                ],
                [
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $this->command->info('Permissions seeded successfully.');
    }
}