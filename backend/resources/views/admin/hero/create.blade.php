@extends('layouts.admin')

@section('header', 'Upload Hero Media')

@section('content')
<div class="max-w-2xl mx-auto">
    <a href="{{ route('admin.hero.index') }}" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs mb-8">
        ← Back to list
    </a>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <form action="{{ route('admin.hero.store') }}" method="POST" enctype="multipart/form-data" class="space-y-8" x-data="{ uploading: false, progress: 0 }">
            @csrf
            
            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Campaign Title *</label>
                <input type="text" name="title" required placeholder="e.g. Summer Batch 2026 Admissions" 
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                @error('title') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hero Video (MP4) *</label>
                    <input type="file" name="video" required accept="video/mp4"
                           class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-black transition-all">
                    <p class="text-[9px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Max: 50MB · High Quality Recommended</p>
                    @error('video') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Modal Video (Optional)</label>
                    <input type="file" name="modal_video" accept="video/mp4"
                           class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 transition-all">
                    <p class="text-[9px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Defaults to Hero Video if empty</p>
                </div>
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fallback Thumbnail (Optional)</label>
                <input type="file" name="thumbnail" accept="image/*"
                       class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 transition-all">
                @error('thumbnail') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="is_active" value="1" checked class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer">
                <span class="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors uppercase tracking-widest">Set as Active Homepage Hero 🎬</span>
            </label>

            <button type="submit" 
                    @click="uploading = true"
                    class="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                <span x-show="!uploading">Start Upload →</span>
                <span x-show="uploading" class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Uploading... Please wait
                </span>
            </button>
        </form>
    </div>
</div>
@endsection
