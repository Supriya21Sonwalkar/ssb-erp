<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Admin;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        Permission::findOrCreate('manage-enquiries', 'admin');
        Permission::findOrCreate('manage-media', 'admin');
        Permission::findOrCreate('manage-gallery', 'admin');
        Permission::findOrCreate('manage-hero', 'admin');
        Permission::findOrCreate('manage-users', 'admin');

        // Create Roles
        $superAdmin = Role::findOrCreate('super-admin', 'admin');

        $counsellor = Role::findOrCreate('counsellor', 'admin');
        $counsellor->givePermissionTo('manage-enquiries');

        $mediaManager = Role::findOrCreate('media-manager', 'admin');
        $mediaManager->givePermissionTo([
            'manage-media',
            'manage-gallery',
            'manage-hero',
        ]);

        $contentEditor = Role::findOrCreate('content-editor', 'admin');
        $contentEditor->givePermissionTo([
            'manage-gallery',
            'manage-hero',
        ]);

        // Assign super-admin role
        $admin = Admin::where('email', 'admin@ada.com')->first();

        if ($admin) {
            $admin->assignRole($superAdmin);
        }
    }
}