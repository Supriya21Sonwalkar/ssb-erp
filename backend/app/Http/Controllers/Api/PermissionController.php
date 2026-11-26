<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
    /**
     * Get all permissions.
     */
    public function index()
    {
        $permissions = Permission::orderBy('name', 'asc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Permissions fetched successfully.',
            'data' => $permissions
        ], 200);
    }

    /**
     * Get permissions assigned to a particular role.
     */
    public function rolePermissions($roleId)
    {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'status' => false,
                'message' => 'Role not found.'
            ], 404);
        }

        $permissions = $role->permissions()
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Role permissions fetched successfully.',
            'data' => [
                'role' => $role,
                'permissions' => $permissions
            ]
        ], 200);
    }

    /**
     * Assign permissions to a role.
     */
    public function assignRolePermissions(Request $request, $roleId)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'required|integer|distinct|exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'status' => false,
                'message' => 'Role not found.'
            ], 404);
        }

        $permissions = Permission::whereIn(
            'id',
            $request->input('permissions')
        )->get();

        foreach ($permissions as $permission) {
            if ($permission->guard_name !== $role->guard_name) {
                return response()->json([
                    'status' => false,
                    'message' => 'Permission guard does not match the role guard.'
                ], 422);
            }
        }

        $role->syncPermissions($permissions);

        return response()->json([
            'status' => true,
            'message' => 'Role permissions updated successfully.',
            'data' => [
                'role_id' => $role->id,
                'permissions' => $role->permissions()->orderBy('name', 'asc')->get()
            ]
        ], 200);
    }
}