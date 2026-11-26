<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigurationMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'configuration')
            ->first();

        if (!$module) {
            $this->command->error('Configuration module not found.');
            return;
        }

        $menus = [
            [
                'menu_name' => 'Dashboard',
                'menu_slug' => 'configuration-dashboard',
                'route' => '/configuration/dashboard',
                'parent_slug' => null,
                'display_order' => 1,
            ],
            [
                'menu_name' => 'Modules',
                'menu_slug' => 'configuration-modules',
                'route' => '/configuration/modules',
                'parent_slug' => null,
                'display_order' => 2,
            ],
            [
                'menu_name' => 'Employees',
                'menu_slug' => 'configuration-employees',
                'route' => '/configuration/employees',
                'parent_slug' => null,
                'display_order' => 3,
            ],
            [
                'menu_name' => 'Branches',
                'menu_slug' => 'configuration-branches',
                'route' => '/configuration/branches',
                'parent_slug' => null,
                'display_order' => 4,
            ],
            [
                'menu_name' => 'Departments',
                'menu_slug' => 'configuration-departments',
                'route' => '/configuration/departments',
                'parent_slug' => null,
                'display_order' => 5,
            ],
            [
                'menu_name' => 'Designations',
                'menu_slug' => 'configuration-designations',
                'route' => '/configuration/designations',
                'parent_slug' => null,
                'display_order' => 6,
            ],
            [
                'menu_name' => 'Employee Types',
                'menu_slug' => 'configuration-employee-types',
                'route' => '/configuration/employee-types',
                'parent_slug' => null,
                'display_order' => 7,
            ],
            [
                'menu_name' => 'Roles',
                'menu_slug' => 'configuration-roles',
                'route' => '/configuration/roles',
                'parent_slug' => null,
                'display_order' => 8,
            ],
            [
                'menu_name' => 'Shifts',
                'menu_slug' => 'configuration-shifts',
                'route' => '/configuration/shifts',
                'parent_slug' => null,
                'display_order' => 9,
            ],
            [
                'menu_name' => 'Asset Categories',
                'menu_slug' => 'configuration-asset-categories',
                'route' => '/configuration/asset-categories',
                'parent_slug' => null,
                'display_order' => 10,
            ],
            [
                'menu_name' => 'Assets',
                'menu_slug' => 'configuration-assets',
                'route' => '/configuration/assets',
                'parent_slug' => null,
                'display_order' => 11,
            ],
            [
                'menu_name' => 'Asset Subcategories',
                'menu_slug' => 'configuration-asset-subcategories',
                'route' => '/configuration/asset-subcategories',
                'parent_slug' => null,
                'display_order' => 12,
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

        $this->command->info('Configuration menus seeded successfully.');
    }
}