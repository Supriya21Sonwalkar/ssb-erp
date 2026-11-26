@extends('layouts.admin')

@section('header', 'Admin User Management')

@section('content')
<div class="space-y-8">
    <div class="flex justify-between items-center">
        <h3 class="text-gray-500 font-bold uppercase tracking-widest text-xs">Administrative Access</h3>
        <a href="{{ route('admin.users.create') }}" class="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-primary/10">
            + Add New Admin
        </a>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th class="px-8 py-4">Name / Email</th>
                        <th class="px-8 py-4">Role</th>
                        <th class="px-8 py-4">Status</th>
                        <th class="px-8 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @foreach($admins as $admin)
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-8 py-4">
                            <p class="font-bold text-gray-800">{{ $admin->name }}</p>
                            <p class="text-xs text-gray-400">{{ $admin->email }}</p>
                        </td>
                        <td class="px-8 py-4">
                            @php
                                $roleColors = [
                                    'super_admin' => 'bg-primary text-white',
                                    'counsellor' => 'bg-accent text-primary',
                                    'media_manager' => 'bg-blue-50 text-blue-600',
                                    'content_editor' => 'bg-gray-100 text-gray-600'
                                ];
                                $roleLabels = [
                                    'super_admin' => 'Super Admin',
                                    'counsellor' => 'Counsellor',
                                    'media_manager' => 'Media Manager',
                                    'content_editor' => 'Content Editor'
                                ];
                            @endphp
                            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {{ $roleColors[$admin->role] ?? 'bg-gray-100' }}">
                                {{ $roleLabels[$admin->role] ?? $admin->role }}
                            </span>
                        </td>
                        <td class="px-8 py-4">
                            <span class="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Active
                            </span>
                        </td>
                        <td class="px-8 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <a href="{{ route('admin.users.edit', $admin) }}" class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all shadow-sm">✏️</a>
                                @if($admin->id !== auth('admin')->id())
                                <form action="{{ route('admin.users.destroy', $admin) }}" method="POST" onsubmit="return confirm('Revoke all access for this user?')">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑️</button>
                                </form>
                                @endif
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
