<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HomeworkAssignmentManagementMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'homework-assignment-management')
            ->first();

        if (!$module) {
            $this->command->error(
                'Homework & Assignment Management module not found.'
            );
            return;
        }

        $menus = [
            // Homework Posting
            [
                'menu_name' => 'Homework & Assignments',
                'menu_slug' => 'homework-posting',
                'route' => '/homework-assignment',
                'parent_slug' => null,
                'display_order' => 1,
            ],

            // Homework Submissions
            [
                'menu_name' => 'Homework Submissions',
                'menu_slug' => 'homework-submissions',
                'route' => '/homework-assignment/submissions',
                'parent_slug' => null,
                'display_order' => 2,
            ],

            // Track submissions for a homework assignment
            [
                'menu_name' => 'Track Submissions',
                'menu_slug' => 'track-submissions',
                'route' => '/homework-assignment/submissions',
                'parent_slug' => 'homework-submissions',
                'display_order' => 1,
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
            'Homework & Assignment Management menus seeded successfully.'
        );
    }
}