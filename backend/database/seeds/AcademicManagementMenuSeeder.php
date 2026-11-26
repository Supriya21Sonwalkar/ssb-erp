<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AcademicManagementMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'academic-management')
            ->first();

        if (!$module) {
            $this->command->error(
                'Academic Management module not found.'
            );

            return;
        }

        $menus = [
            [
                'menu_name' => 'Academic Year',
                'menu_slug' => 'academic-year',
                'route' => '/academic-management/academic-year',
                'display_order' => 1,
            ],
            [
                'menu_name' => 'Classes',
                'menu_slug' => 'classes',
                'route' => '/academic-management/classes',
                'display_order' => 2,
            ],
            [
                'menu_name' => 'Sections',
                'menu_slug' => 'sections',
                'route' => '/academic-management/sections',
                'display_order' => 3,
            ],
            [
                'menu_name' => 'Subjects',
                'menu_slug' => 'subjects',
                'route' => '/academic-management/subjects',
                'display_order' => 4,
            ],
            [
                'menu_name' => 'Class Subjects',
                'menu_slug' => 'class-subjects',
                'route' => '/academic-management/class-subjects',
                'display_order' => 5,
            ],
            [
                'menu_name' => 'Teacher Allocations',
                'menu_slug' => 'teacher-allocations',
                'route' => '/academic-management/teacher-allocations',
                'display_order' => 6,
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
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info(
            'Academic Management menus seeded successfully.'
        );
    }
}