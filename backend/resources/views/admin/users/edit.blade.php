@extends('layouts.admin')

@section('header', 'Edit Admin User')

@section('content')
<div class="max-w-2xl mx-auto">
    <a href="{{ route('admin.users.index') }}" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs mb-8">
        ← Back to list
    </a>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <form action="{{ route('admin.users.update', $user) }}" method="POST" class="space-y-8">
            @csrf @method('PUT')
            
            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                <input type="text" name="name" value="{{ $user->name }}" required
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                @error('name') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                <input type="email" name="email" value="{{ $user->email }}" required
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                @error('email') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Administrative Role *</label>
                <select name="role" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    <option value="content_editor" {{ $user->role === 'content_editor' ? 'selected' : '' }}>Content Editor (Gallery, Hero)</option>
                    <option value="media_manager" {{ $user->role === 'media_manager' ? 'selected' : '' }}>Media Manager (Library, Uploads)</option>
                    <option value="counsellor" {{ $user->role === 'counsellor' ? 'selected' : '' }}>Counsellor (Enquiries)</option>
                    <option value="super_admin" {{ $user->role === 'super_admin' ? 'selected' : '' }}>Super Admin (Full Access)</option>
                </select>
                @error('role') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <div class="pt-6 border-t border-gray-50">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Security Update (Optional)</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                        <input type="password" name="password" 
                               class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                        <input type="password" name="password_confirmation" 
                               class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    </div>
                </div>
                <p class="text-[9px] text-gray-400 mt-2 italic">Leave passwords empty to keep the current one.</p>
                @error('password') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <button type="submit" class="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-primary/20">
                Update Admin Permissions
            </button>
        </form>
    </div>
</div>
@endsection
