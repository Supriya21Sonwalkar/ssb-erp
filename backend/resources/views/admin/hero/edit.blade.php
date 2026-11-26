@extends('layouts.admin')

@section('header', 'Edit Hero Media')

@section('content')
<div class="max-w-2xl mx-auto">
    <a href="{{ route('admin.hero.index') }}" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs mb-8">
        ← Back to list
    </a>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <form action="{{ route('admin.hero.update', $hero) }}" method="POST" enctype="multipart/form-data" class="space-y-8" x-data="{ uploading: false }">
            @csrf @method('PUT')
            
            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Campaign Title *</label>
                <input type="text" name="title" value="{{ $hero->title }}" required
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
            </div>

            <div class="aspect-video bg-black rounded-2xl overflow-hidden mb-8 border-4 border-gray-100 shadow-inner">
                <video controls muted class="w-full h-full object-cover">
                    <source src="{{ asset($hero->video_path) }}" type="video/mp4">
                </video>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Replace Hero Video</label>
                    <input type="file" name="video" accept="video/mp4"
                           class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 transition-all">
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Replace Modal Video</label>
                    <input type="file" name="modal_video" accept="video/mp4"
                           class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 transition-all">
                </div>
            </div>

            <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="is_active" value="1" {{ $hero->is_active ? 'checked' : '' }} class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer">
                <span class="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors uppercase tracking-widest">Active Homepage Hero</span>
            </label>

            <button type="submit" 
                    @click="uploading = true"
                    class="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                <span x-show="!uploading">Update Media →</span>
                <span x-show="uploading">Processing...</span>
            </button>
        </form>
    </div>
</div>
@endsection
