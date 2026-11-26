<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentManagementMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'student-management')
            ->first();

        if (!$module) {
            $this->command->error('Student Management module not found.');
            return;
        }

        $menus = [
            [
                'menu_name' => 'Students',
                'menu_slug' => 'students',
                'route' => '/student-management/students',
                'display_order' => 1,
            ],
            [
                'menu_name' => 'Inactive Students',
                'menu_slug' => 'inactive-students',
                'route' => '/student-management/students/inactive',
                'display_order' => 2,
            ],
            [
                'menu_name' => 'Student Bulk Import',
                'menu_slug' => 'student-bulk-import',
                'route' => '/student-management/students/bulk-import',
                'display_order' => 3,
            ],
        ];

        foreach ($menus as $menu) {
            DB::table('menus')->updateOrInsert(
                [
                    'module_id' => $module->id,
                    'menu_slug' => $menu['menu_slug'],
                ],
                [
                    'parent_id' => null,
                    'menu_name' => $menu['menu_name'],
                    'route' => $menu['route'],
                    'icon' => null,
                    'display_order' => $menu['display_order'],
                    'is_clickable' => 1,
                    'status' => 1,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $this->command->info(
            'Student Management menus seeded successfully.'
        );
    }
}