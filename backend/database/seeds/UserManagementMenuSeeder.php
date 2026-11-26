<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserManagementMenuSeeder extends Seeder
{
    public function run()
    {
        $module = DB::table('modules')
            ->where('module_slug', 'user-management')
            ->first();

        if (!$module) {
            $this->command->error('User Management module not found.');
            return;
        }

        $menus = [
            [
                'menu_name' => 'Dashboard',
                'menu_slug' => 'user-management-dashboard',
                'route' => '/user-management/dashboard',
                'display_order' => 1,
            ],
            [
                'menu_name' => 'Roles',
                'menu_slug' => 'user-management-roles',
                'route' => '/user-management/roles',
                'display_order' => 2,
            ],
            [
                'menu_name' => 'Users',
                'menu_slug' => 'user-management-users',
                'route' => '/user-management/users',
                'display_order' => 3,
            ],
            [
                'menu_name' => 'Roles & Permissions',
                'menu_slug' => 'user-management-roles-permissions',
                'route' => '/user-management/roles-permissions',
                'display_order' => 4,
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
            'User Management menus seeded successfully.'
        );
    }
}