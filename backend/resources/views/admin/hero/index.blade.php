@extends('layouts.admin')

@section('header', 'Hero Section Media')

@section('content')
<div class="space-y-8">
    <div class="flex justify-between items-center">
        <h3 class="text-gray-500 font-bold uppercase tracking-widest text-xs">Home Hero Media</h3>
        <a href="{{ route('admin.hero.create') }}" class="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-primary/10">
            + Upload New Media
        </a>
    </div>

    @if(session('error'))
    <div class="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold">
        {{ session('error') }}
    </div>
    @endif

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @foreach($media as $item)
        <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500 relative">
            <!-- Status Badge -->
            <div class="absolute top-4 right-4 z-10">
                @if($item->is_active)
                    <span class="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Active Hero</span>
                @else
                    <span class="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-gray-200">Inactive</span>
                @endif
            </div>

            <!-- Video Preview Container -->
            <div class="aspect-video bg-black relative group-hover:scale-105 transition-transform duration-700">
                <video muted class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                    <source src="{{ asset($item->video_path) }}" type="video/mp4">
                </video>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl">▶</div>
                </div>
            </div>

            <!-- Content -->
            <div class="p-6">
                <h4 class="font-bold text-primary mb-1 truncate">{{ $item->title }}</h4>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-6">Added {{ $item->created_at->format('M d, Y') }}</p>
                
                <div class="flex items-center justify-between gap-4">
                    <div class="flex gap-2">
                        <a href="{{ route('admin.hero.edit', $item) }}" class="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all">Edit</a>
                        <form action="{{ route('admin.hero.destroy', $item) }}" method="POST" onsubmit="return confirm('Delete this media?')">
                            @csrf @method('DELETE')
                            <button type="submit" class="bg-gray-100 text-red-400 px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all">Delete</button>
                        </form>
                    </div>
                    @if(!$item->is_active)
                    <form action="{{ route('admin.hero.update', $item) }}" method="POST">
                        @csrf @method('PUT')
                        <input type="hidden" name="title" value="{{ $item->title }}">
                        <input type="hidden" name="is_active" value="1">
                        <button type="submit" class="bg-accent text-primary px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary hover:text-accent transition-all shadow-sm">Activate</button>
                    </form>
                    @endif
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection
