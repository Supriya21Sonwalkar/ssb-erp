@extends('layouts.admin')

@section('header', 'Manage Courses')

@section('content')
<div class="space-y-8">
    <div class="flex justify-between items-end">
        <div>
            <h3 class="text-gray-500 font-bold uppercase tracking-widest text-xs">Training Programs</h3>
            <p class="text-3xl font-black text-primary mt-2">Course Catalog</p>
        </div>
        <a href="{{ route('admin.courses.create') }}" class="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-primary/20 flex items-center gap-3">
            <span>+</span> Add New Course
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @foreach($courses as $course)
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div class="aspect-video relative overflow-hidden bg-gray-100">
                @if($course->image_path)
                    <img src="{{ asset($course->image_path) }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                @else
                    <div class="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                @endif
                
                <div class="absolute top-4 right-4 flex gap-2">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {{ $course->is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white' }}">
                        {{ $course->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </div>
            </div>
            
            <div class="p-6">
                <h4 class="text-xl font-bold text-gray-900 mb-2">{{ $course->title }}</h4>
                <div class="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6">
                    <span class="flex items-center gap-1">⏱ {{ $course->duration ?? 'N/A' }}</span>
                    <span class="flex items-center gap-1">🔢 Order: {{ $course->order_number }}</span>
                </div>

                <div class="flex gap-3">
                    <a href="{{ route('admin.courses.edit', $course) }}" class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all">Edit</a>
                    <form action="{{ route('admin.courses.destroy', $course) }}" method="POST" class="inline" onsubmit="return confirm('Delete this course?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            🗑
                        </button>
                    </form>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection
