<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeesManagementMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'fees-management')
            ->first();

        if (!$module) {
            $this->command->error('Fees Management module not found.');
            return;
        }

        $menus = [
            [
                'menu_name' => 'Courses',
                'menu_slug' => 'fees-courses',
                'route' => '/fees/courses',
                'display_order' => 1,
            ],
            [
                'menu_name' => 'Components',
                'menu_slug' => 'fees-components',
                'route' => '/fees/components',
                'display_order' => 2,
            ],
            [
                'menu_name' => 'Installments',
                'menu_slug' => 'fees-installments',
                'route' => '/fees/installments',
                'display_order' => 3,
            ],
            [
                'menu_name' => 'Fees Structure',
                'menu_slug' => 'fees-structure',
                'route' => '/fees/structure',
                'display_order' => 4,
            ],
            [
                'menu_name' => 'Fees Collection',
                'menu_slug' => 'fees-collection',
                'route' => '/fees/collection',
                'display_order' => 5,
            ],
            [
                'menu_name' => 'Fee Waivers',
                'menu_slug' => 'fees-waivers',
                'route' => '/fees/waivers',
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
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $this->command->info('Fees Management menus seeded successfully.');
    }
}