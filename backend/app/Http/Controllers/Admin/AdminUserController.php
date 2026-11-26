<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class AdminUserController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-users');
        $admins = Admin::all();
        return view('admin.users.index', compact('admins'));
    }

    public function create()
    {
        Gate::authorize('manage-users');
        return view('admin.users.create');
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-users');
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:super_admin,counsellor,media_manager,content_editor',
        ]);

        Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Admin user created.');
    }

    public function edit(Admin $user)
    {
        Gate::authorize('manage-users');
        return view('admin.users.edit', compact('user'));
    }

    public function update(Request $request, Admin $user)
    {
        Gate::authorize('manage-users');
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins,email,' . $user->id,
            'role' => 'required|in:super_admin,counsellor,media_manager,content_editor',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'Admin user updated.');
    }

    public function destroy(Admin $user)
    {
        Gate::authorize('super-admin');
        if ($user->id === auth('admin')->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }
        $user->delete();
        return back()->with('success', 'Admin user removed.');
    }
}
