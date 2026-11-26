<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * List all roles.
     */
    public function index()
    {
        $roles = Role::with('permissions')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Roles fetched successfully.',
            'data' => $roles,
        ]);
    }

    /**
     * Show a single role.
     */
    public function show($id)
    {
        $role = Role::with('permissions')->find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role fetched successfully.',
            'data' => $role,
        ]);
    }

    /**
     * Create a role.
     */
    public function store(Request $request)
    {
        $guardName = $request->input('guard_name', 'admin');

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->where(function ($query) use ($guardName) {
                        return $query->where('guard_name', $guardName);
                    }),
            ],
            'guard_name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'sometimes|boolean',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'required|integer|distinct|exists:permissions,id',
        ]);

        $guardName = !empty($validated['guard_name'])
            ? $validated['guard_name']
            : 'admin';

        $permissionIds = isset($validated['permissions'])
            ? $validated['permissions']
            : [];

        $permissionError = $this->validatePermissions(
            $permissionIds,
            $guardName
        );

        if ($permissionError) {
            return response()->json([
                'success' => false,
                'message' => $permissionError,
            ], 422);
        }

        DB::beginTransaction();

        try {
            $role = Role::create([
                'name' => $validated['name'],
                'guard_name' => $guardName,
                'description' => isset($validated['description'])
                    ? $validated['description']
                    : null,
                'status' => isset($validated['status'])
                    ? $validated['status']
                    : 1,
                'is_system' => 0,
            ]);

            if (!empty($permissionIds)) {
                $role->syncPermissions($permissionIds);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role created successfully.',
                'data' => $role->load('permissions'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to create role.',
            ], 500);
        }
    }

    /**
     * Update a role.
     */
    public function update(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->where(function ($query) use ($role) {
                        return $query->where(
                            'guard_name',
                            $role->guard_name
                        );
                    })
                    ->ignore($role->id),
            ],
            'description' => 'nullable|string|max:1000',
            'status' => 'required|boolean',
            'permissions' => 'sometimes|array',
            'permissions.*' => 'required|integer|distinct|exists:permissions,id',
        ]);

        $permissionIds = isset($validated['permissions'])
            ? $validated['permissions']
            : [];

        if (array_key_exists('permissions', $validated)) {
            $permissionError = $this->validatePermissions(
                $permissionIds,
                $role->guard_name
            );

            if ($permissionError) {
                return response()->json([
                    'success' => false,
                    'message' => $permissionError,
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            $role->update([
                'name' => $validated['name'],
                'description' => isset($validated['description'])
                    ? $validated['description']
                    : null,
                'status' => $validated['status'],
            ]);

            // Only synchronize permissions when provided in the request.
            if (array_key_exists('permissions', $validated)) {
                $role->syncPermissions($permissionIds);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role updated successfully.',
                'data' => $role->fresh()->load('permissions'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to update role.',
            ], 500);
        }
    }

    /**
     * Delete a role.
     */
    public function destroy($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found.',
            ], 404);
        }

        if ($role->is_system) {
            return response()->json([
                'success' => false,
                'message' => 'System roles cannot be deleted.',
            ], 422);
        }

        $assignedUsers = DB::table('users')
            ->where('role_id', $role->id)
            ->exists();

        if ($assignedUsers) {
            return response()->json([
                'success' => false,
                'message' => 'This role is assigned to users and cannot be deleted.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $role->syncPermissions([]);
            $role->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Role deleted successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to delete role.',
            ], 500);
        }
    }

    /**
     * Validate that permissions belong to the specified guard.
     */
    private function validatePermissions(array $permissionIds, $guardName)
    {
        if (empty($permissionIds)) {
            return null;
        }

        $invalidPermissions = Permission::whereIn('id', $permissionIds)
            ->where('guard_name', '!=', $guardName)
            ->exists();

        if ($invalidPermissions) {
            return 'Selected permissions do not match the role guard.';
        }

        return null;
    }
}