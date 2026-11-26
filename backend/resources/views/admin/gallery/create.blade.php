@extends('layouts.admin')

@section('header', 'Add to Gallery')

@section('content')
<div class="max-w-2xl mx-auto">
    <a href="{{ route('admin.gallery.index') }}" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs mb-8">
        ← Back to list
    </a>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <form action="{{ route('admin.gallery.store') }}" method="POST" enctype="multipart/form-data" class="space-y-8">
            @csrf
            
            <div x-data="{ photoName: null, photoPreview: null }">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Gallery Image *</label>
                
                <!-- Photo Preview -->
                <div x-show="photoPreview" class="mb-6">
                    <span class="block w-full h-64 rounded-2xl border border-gray-100 shadow-inner bg-cover bg-center"
                          :style="'background-image: url(\'' + photoPreview + '\');'">
                    </span>
                </div>

                <!-- Placeholder -->
                <div x-show="!photoPreview" class="mb-6">
                    <div class="w-full h-64 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <span class="text-4xl mb-2">📸</span>
                        <p class="text-xs font-bold uppercase tracking-widest">Select Image</p>
                    </div>
                </div>

                <input type="file" name="image" required class="hidden" x-ref="photo"
                       @change="
                            photoName = $refs.photo.files[0].name;
                            const reader = new FileReader();
                            reader.onload = (e) => { photoPreview = e.target.result; };
                            reader.readAsDataURL($refs.photo.files[0]);
                       ">
                
                <button type="button" @click="$refs.photo.click()" class="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">
                    Choose Image
                </button>
                @error('image') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Image Title (Optional)</label>
                <input type="text" name="title" placeholder="e.g. Morning PT Session" 
                       class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category *</label>
                <select name="gallery_category_id" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    @foreach($categories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="flex flex-wrap gap-8">
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_featured" value="1" class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer">
                    <span class="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors uppercase tracking-widest">Mark as Featured ⭐</span>
                </label>

                <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_active" value="1" checked class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer">
                    <span class="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors uppercase tracking-widest">Visible on Website 👁️</span>
                </label>
            </div>

            <button type="submit" class="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-primary/20">
                Upload to Gallery
            </button>
        </form>
    </div>
</div>
@endsection
