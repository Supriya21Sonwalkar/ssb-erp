<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RoleMenuPermissionController extends Controller
{
    /**
     * Get all active roles.
     */
    public function roles()
    {
        $roles = Role::where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Get all active modules.
     */
    public function modules()
    {
        $modules = DB::table('modules')
            ->where('status', 1)
            ->orderBy('display_order')
            ->get([
                'id',
                'module_name',
                'module_slug',
            ]);

        return response()->json([
            'success' => true,
            'data' => $modules,
        ]);
    }

    /**
     * Get menus belonging to a module and the selected role's assignments.
     */
    public function moduleMenus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|integer|exists:roles,id',
            'module_id' => 'required|integer|exists:modules,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid role or module.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $roleId = $request->role_id;
        $moduleId = $request->module_id;

        $assignedMenuIds = DB::table('role_menu_permissions')
            ->where('role_id', $roleId)
            ->pluck('menu_id')
            ->map(function ($id) {
                return (int) $id;
            })
            ->toArray();

        $menus = DB::table('menus')
            ->where('module_id', $moduleId)
            ->where('status', 1)
            ->orderBy('display_order')
            ->get([
                'id',
                'module_id',
                'parent_id',
                'menu_name',
                'menu_slug',
                'route',
                'display_order',
                'is_clickable',
            ]);

        $menus->transform(function ($menu) use ($assignedMenuIds) {
            $menu->id = (int) $menu->id;
            $menu->parent_id = $menu->parent_id !== null
                ? (int) $menu->parent_id
                : null;

            $menu->has_access = in_array(
                $menu->id,
                $assignedMenuIds,
                true
            );

            return $menu;
        });

        return response()->json([
            'success' => true,
            'data' => $menus,
        ]);
    }

    /**
     * Save menu assignments for a role.
     */
    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|integer|exists:roles,id',
            'module_id' => 'required|integer|exists:modules,id',
            'menu_ids' => 'present|array',
            'menu_ids.*' => 'integer|distinct|exists:menus,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid permission data.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $roleId = (int) $request->role_id;
        $moduleId = (int) $request->module_id;
        $menuIds = array_map('intval', $request->menu_ids);

        // Only allow menus belonging to the selected module.
        $validMenuIds = DB::table('menus')
            ->where('module_id', $moduleId)
            ->where('status', 1)
            ->whereIn('id', $menuIds)
            ->pluck('id')
            ->map(function ($id) {
                return (int) $id;
            })
            ->toArray();

        if (count($validMenuIds) !== count(array_unique($menuIds))) {
            return response()->json([
                'success' => false,
                'message' => 'One or more menus do not belong to the selected module or are inactive.',
            ], 422);
        }

        DB::transaction(function () use ($roleId, $moduleId, $menuIds) {
            // Remove previous assignments only for this role and module.
            $moduleMenuIds = DB::table('menus')
                ->where('module_id', $moduleId)
                ->pluck('id')
                ->toArray();

            DB::table('role_menu_permissions')
                ->where('role_id', $roleId)
                ->whereIn('menu_id', $moduleMenuIds)
                ->delete();

            // Save the newly selected menus.
            if (!empty($menuIds)) {
                $rows = [];

                foreach ($menuIds as $menuId) {
                    $rows[] = [
                        'role_id' => $roleId,
                        'menu_id' => $menuId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                DB::table('role_menu_permissions')->insert($rows);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Menu permissions saved successfully.',
        ]);
    }

    /**
     * Return menus accessible to the logged-in user's role.
     * Super Admin can access all active menus without assignments.
     */
    public function myMenus()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Identify the user's role.
        $roleName = DB::table('roles')
            ->where('id', $user->role_id)
            ->value('name');

        $isSuperAdmin = strtolower(trim((string) $roleName)) === 'super admin';

        // Start with all active menus belonging to active modules.
        $query = DB::table('menus as m')
            ->join('modules as mo', 'mo.id', '=', 'm.module_id')
            ->where('m.status', 1)
            ->where('mo.status', 1);

        // Other roles can see only their assigned menus.
        if (!$isSuperAdmin) {
            $query->whereExists(function ($subQuery) use ($user) {
                $subQuery->select(DB::raw(1))
                    ->from('role_menu_permissions as rmp')
                    ->whereColumn('rmp.menu_id', 'm.id')
                    ->where('rmp.role_id', $user->role_id);
            });
        }

        $menus = $query
            ->select(
                'm.id as menu_id',
                'm.menu_name',
                'm.menu_slug',
                'm.route',
                'm.parent_id',
                'm.module_id',
                'mo.module_name',
                'mo.module_slug'
            )
            ->orderBy('mo.display_order')
            ->orderBy('m.display_order')
            ->get();

        return response()->json([
            'success' => true,
            'role_id' => (int) $user->role_id,
            'is_super_admin' => $isSuperAdmin,
            'data' => $menus,
        ]);
    }
}