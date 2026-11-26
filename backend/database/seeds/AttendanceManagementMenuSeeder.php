<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceManagementMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'attendance-management')
            ->first();

        if (!$module) {
            $this->command->error(
                'Attendance Management module not found.'
            );
            return;
        }

        $menus = [
            // Daily Attendance
            [
                'menu_name' => 'Daily Attendance',
                'menu_slug' => 'daily-attendance',
                'route' => '/attendance-management/daily-attendance',
                'parent_slug' => null,
                'display_order' => 1,
            ],

            // Lecture Attendance
            [
                'menu_name' => 'Lecture Attendance',
                'menu_slug' => 'lecture-attendance',
                'route' => '/attendance-management/lecture-attendance',
                'parent_slug' => null,
                'display_order' => 2,
            ],

            // Attendance Reports parent
            [
                'menu_name' => 'Attendance Reports',
                'menu_slug' => 'attendance-reports',
                'route' => '/attendance-management/reports',
                'parent_slug' => null,
                'display_order' => 3,
            ],

            // Attendance Reports subtabs
            [
                'menu_name' => 'Daily Attendance Report',
                'menu_slug' => 'daily-attendance-report',
                'route' => '/attendance-management/reports/daily',
                'parent_slug' => 'attendance-reports',
                'display_order' => 1,
            ],
            [
                'menu_name' => 'Student Attendance Report',
                'menu_slug' => 'student-attendance-report',
                'route' => '/attendance-management/reports/student',
                'parent_slug' => 'attendance-reports',
                'display_order' => 2,
            ],
            [
                'menu_name' => 'Class Attendance Report',
                'menu_slug' => 'class-attendance-report',
                'route' => '/attendance-management/reports/class',
                'parent_slug' => 'attendance-reports',
                'display_order' => 3,
            ],
            [
                'menu_name' => 'Monthly Attendance Report',
                'menu_slug' => 'monthly-attendance-report',
                'route' => '/attendance-management/reports/monthly',
                'parent_slug' => 'attendance-reports',
                'display_order' => 4,
            ],
        ];

        foreach ($menus as $menu) {
            $parentId = null;

            if (!empty($menu['parent_slug'])) {
                $parent = DB::table('menus')
                    ->where('module_id', $module->id)
                    ->where('menu_slug', $menu['parent_slug'])
                    ->first();

                if (!$parent) {
                    $this->command->error(
                        'Parent menu not found: ' . $menu['parent_slug']
                    );
                    continue;
                }

                $parentId = $parent->id;
            }

            DB::table('menus')->updateOrInsert(
                [
                    'module_id' => $module->id,
                    'menu_slug' => $menu['menu_slug'],
                ],
                [
                    'parent_id' => $parentId,
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
            'Attendance Management menus seeded successfully.'
        );
    }
}