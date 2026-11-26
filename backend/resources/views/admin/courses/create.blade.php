@extends('layouts.admin')

@section('header', 'Add New Course')

@section('content')
<div class="max-w-4xl">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-8 md:p-12">
        <form action="{{ route('admin.courses.store') }}" method="POST" enctype="multipart/form-data" class="space-y-8">
            @csrf
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <label class="text-xs font-black uppercase tracking-widest text-gray-400">Course Title</label>
                    <input type="text" name="title" required class="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium">
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-black uppercase tracking-widest text-gray-400">Duration (e.g. 6 Months)</label>
                    <input type="text" name="duration" class="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium">
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                <textarea name="description" rows="4" class="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium"></textarea>
            </div>

            <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-gray-400">Course Thumbnail</label>
                <input type="file" name="image" class="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium">
                <p class="text-[10px] text-gray-400">Recommended size: 800x600px. WebP optimization will be applied.</p>
            </div>

            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <input type="checkbox" name="is_active" id="is_active" checked class="w-5 h-5 rounded text-primary focus:ring-primary">
                <label for="is_active" class="text-sm font-bold text-gray-700">Set as Active (Visible on frontend)</label>
            </div>

            <div class="flex gap-4 pt-4">
                <button type="submit" class="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-primary/20">
                    Create Course
                </button>
                <a href="{{ route('admin.courses.index') }}" class="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                    Cancel
                </a>
            </div>
        </form>
    </div>
</div>
@endsection
