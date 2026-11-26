@extends('layouts.admin')

@section('header', 'Media Library')

@section('content')
<div class="space-y-8" x-data="{ uploadModal: false }">
    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h3 class="text-gray-500 font-bold uppercase tracking-widest text-xs">Centralized Assets</h3>
        </div>
        <div class="flex flex-wrap gap-4 w-full md:w-auto">
            <form action="{{ route('admin.media.index') }}" method="GET" class="relative flex-1 md:w-64">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Search files..." 
                       class="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all pl-10 shadow-sm">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </form>
            <button @click="uploadModal = true" class="bg-primary text-white px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-primary/10">
                + Upload New
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 border-b border-gray-100 pb-4 overflow-x-auto">
        <a href="{{ route('admin.media.index') }}" class="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {{ !request('type') ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary transition-colors' }}">All Files</a>
        <a href="{{ route('admin.media.index', ['type' => 'image']) }}" class="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {{ request('type') === 'image' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary transition-colors' }}">Images</a>
        <a href="{{ route('admin.media.index', ['type' => 'video']) }}" class="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {{ request('type') === 'video' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary transition-colors' }}">Videos</a>
        <a href="{{ route('admin.media.index', ['type' => 'application']) }}" class="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest {{ request('type') === 'application' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary transition-colors' }}">Documents</a>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        @forelse($media as $item)
        <div class="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <!-- File Preview -->
            <div class="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                @if($item->isImage())
                    <img src="{{ $item->url }}" class="w-full h-full object-cover">
                @elseif($item->isVideo())
                    <video class="w-full h-full object-cover">
                        <source src="{{ $item->url }}">
                    </video>
                    <div class="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-2xl">🎬</div>
                @elseif($item->isPdf())
                    <div class="text-4xl">📄</div>
                @else
                    <div class="text-4xl">📁</div>
                @endif
                
                <!-- Quick Actions Overlay -->
                <div class="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button @click="navigator.clipboard.writeText('{{ $item->url }}'); alert('URL copied!')" class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all text-xs" title="Copy URL">🔗</button>
                    <form action="{{ route('admin.media.destroy', $item) }}" method="POST" onsubmit="return confirm('Delete this file permanently?')">
                        @csrf @method('DELETE')
                        <button type="submit" class="w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all text-xs" title="Delete">🗑️</button>
                    </form>
                </div>
            </div>
            
            <!-- Details -->
            <div class="p-3">
                <p class="text-[10px] font-bold text-primary truncate" title="{{ $item->original_name }}">{{ $item->original_name }}</p>
                <div class="flex justify-between items-center mt-1">
                    <p class="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{{ $item->formatted_size }}</p>
                    <p class="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{{ strtoupper(explode('/', $item->mime_type)[1] ?? 'FILE') }}</p>
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full py-20 text-center text-gray-400 flex flex-col items-center">
            <span class="text-6xl mb-4">📭</span>
            <p class="font-bold uppercase tracking-widest text-xs">Your library is empty</p>
            <p class="text-[10px] mt-2">Upload assets to see them here.</p>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    <div class="mt-12">
        {{ $media->links() }}
    </div>

    <!-- Upload Modal -->
    <template x-teleport="body">
        <div x-show="uploadModal" 
             class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/80 backdrop-blur-sm"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100">
            
            <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8" @click.away="uploadModal = false">
                <div class="flex justify-between items-center mb-8">
                    <h4 class="font-serif font-bold text-2xl text-primary">Upload Assets</h4>
                    <button @click="uploadModal = false" class="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                </div>

                <form action="{{ route('admin.media.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                    @csrf
                    <div class="border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center group hover:border-primary/20 transition-colors cursor-pointer relative">
                        <input type="file" name="file" required class="absolute inset-0 opacity-0 cursor-pointer" onchange="this.form.submit()">
                        <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">☁️</div>
                        <p class="text-sm font-bold text-primary uppercase tracking-widest">Click to Upload</p>
                        <p class="text-[10px] text-gray-400 mt-2">Max file size: 50MB · Images, Videos, PDFs</p>
                    </div>
                </form>
                
                <div class="mt-8 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                    Files will be added to the centralized library instantly.
                </div>
            </div>
        </div>
    </template>
</div>
@endsection
