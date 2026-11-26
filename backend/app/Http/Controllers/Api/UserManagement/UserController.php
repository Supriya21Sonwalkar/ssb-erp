<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display all users.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search users
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Filter by role
        if ($request->filled('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('id', 'desc')->get();

        $users->transform(function ($user) {
            $user->role = Role::find($user->role_id);

            return $user;
        });

        return response()->json([
            'success' => true,
            'message' => 'Users fetched successfully.',
            'data' => $users,
        ]);
    }

    /**
     * Store a new user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|integer|exists:roles,id',
            'status' => 'sometimes|in:0,1',
        ]);

        // Check whether the selected role is active.
        $role = Role::findOrFail($validated['role_id']);

        if (isset($role->status) && (int) $role->status !== 1) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot assign an inactive role to a user.',
            ], 422);
        }

        // Create user without login_id because the column does not exist.
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'status' => isset($validated['status'])
                ? (int) $validated['status']
                : 1,
        ]);

        $user->role = $role;

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    /**
     * Display one user.
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $user->role = Role::find($user->role_id);

        return response()->json([
            'success' => true,
            'message' => 'User fetched successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Update a user.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'password' => 'sometimes|required|string|min:8|confirmed',

            'role_id' => 'sometimes|required|integer|exists:roles,id',

            'status' => 'sometimes|required|in:0,1',
        ]);

        // Prevent assigning inactive roles.
        if (isset($validated['role_id'])) {
            $role = Role::findOrFail($validated['role_id']);

            if (isset($role->status) && (int) $role->status !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot assign an inactive role to a user.',
                ], 422);
            }
        }

        // Hash a new password before saving.
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make(
                $validated['password']
            );
        }

        $user->fill($validated);
        $user->save();

        $user->role = Role::find($user->role_id);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Activate or deactivate a user.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:0,1',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        // Prevent users from deactivating their own account.
        if (
            (int) $user->id === (int) $request->user()->id &&
            (int) $validated['status'] === 0
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot deactivate your own account.',
            ], 422);
        }

        $user->status = (int) $validated['status'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->status
                ? 'User activated successfully.'
                : 'User deactivated successfully.',
            'data' => $user,
        ]);
    }
}