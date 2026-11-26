@extends('layouts.admin')

@section('header', 'Manage Gallery')

@section('content')
<div class="space-y-8">
    <div class="flex justify-between items-center">
        <h3 class="text-gray-500 font-bold uppercase tracking-widest text-xs">Gallery Items</h3>
        <a href="{{ route('admin.gallery.create') }}" class="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-primary/10">
            + Add New Image
        </a>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th class="px-8 py-4">Preview</th>
                        <th class="px-8 py-4">Title / Category</th>
                        <th class="px-8 py-4">Featured</th>
                        <th class="px-8 py-4">Status</th>
                        <th class="px-8 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($galleryItems as $item)
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-8 py-4">
                            <img src="{{ asset($item->image_path) }}" class="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm">
                        </td>
                        <td class="px-8 py-4">
                            <p class="font-bold text-gray-800">{{ $item->title ?? 'Untitled' }}</p>
                            <p class="text-[10px] text-primary font-bold uppercase tracking-widest">{{ $item->galleryCategory->name ?? 'General' }}</p>
                        </td>
                        <td class="px-8 py-4">
                            @if($item->is_featured)
                                <span class="text-accent text-xl">⭐</span>
                            @else
                                <span class="text-gray-200 text-xl">☆</span>
                            @endif
                        </td>
                        <td class="px-8 py-4">
                            @if($item->is_active)
                                <span class="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase ring-1 ring-green-200">Active</span>
                            @else
                                <span class="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase ring-1 ring-gray-200">Hidden</span>
                            @endif
                        </td>
                        <td class="px-8 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <a href="{{ route('admin.gallery.edit', $item) }}" class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all shadow-sm">✏️</a>
                                <form action="{{ route('admin.gallery.destroy', $item) }}" method="POST" onsubmit="return confirm('Remove this image from gallery?')">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑️</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-8 py-20 text-center text-gray-400">
                            No images in gallery yet.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
