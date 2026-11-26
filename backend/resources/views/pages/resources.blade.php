@extends('layouts.app')

@section('title', 'Free Study Materials — SSB Guide Aaryans Defence School')

@section('content')
<!-- Hero -->
<section class="relative pt-40 pb-24 px-6 md:px-12 bg-primary overflow-hidden">
    <div class="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        <span class="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Resources</span>
        <h1 class="font-serif font-black text-5xl md:text-7xl lg:text-8xl text-white mb-8">Free <span class="text-accent">Study</span> Materials</h1>
        <p class="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            Download exam-ready PDFs for NDA, SSB, CDS, AFCAT and current affairs — built for disciplined defence preparation.
        </p>
    </div>
</section>

<!-- Filter Tabs -->
<section x-data="{ activeTab: 'nda_syllabus' }" class="bg-surface py-20 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap justify-center gap-4 mb-20 bg-white p-2 rounded-full shadow-lg inline-flex mx-auto border border-primary/5">
            <button @click="activeTab = 'nda_syllabus'" :class="activeTab === 'nda_syllabus' ? 'bg-primary text-white' : 'text-primary hover:bg-surface'" class="px-8 py-3 rounded-full font-bold transition-all">NDA Syllabus</button>
            <button @click="activeTab = 'ssb_prep'" :class="activeTab === 'ssb_prep' ? 'bg-primary text-white' : 'text-primary hover:bg-surface'" class="px-8 py-3 rounded-full font-bold transition-all">SSB Preparation</button>
            <button @click="activeTab = 'previous_papers'" :class="activeTab === 'previous_papers' ? 'bg-primary text-white' : 'text-primary hover:bg-surface'" class="px-8 py-3 rounded-full font-bold transition-all">Previous Year Papers</button>
            <button @click="activeTab = 'current_affairs'" :class="activeTab === 'current_affairs' ? 'bg-primary text-white' : 'text-primary hover:bg-surface'" class="px-8 py-3 rounded-full font-bold transition-all">Current Affairs</button>
        </div>

        <!-- Resource List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            @foreach($resources as $resource)
            <div x-show="activeTab === '{{ $resource->category }}'" 
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="opacity-0 translate-y-4"
                 x-transition:enter-end="opacity-100 translate-y-0"
                 class="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-primary/5 group relative overflow-hidden">
                
                @if($resource->is_new)
                <div class="absolute top-8 right-8 bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">NEW</div>
                @endif

                <div class="flex items-center gap-6 mb-8">
                    <div class="w-14 h-14 bg-surface text-primary rounded-xl flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                        @if($resource->category == 'nda_syllabus') 📚
                        @elseif($resource->category == 'ssb_prep') 🧠
                        @elseif($resource->category == 'previous_papers') 📜
                        @else 🗞️ @endif
                    </div>
                    <div>
                        <h3 class="font-serif font-bold text-2xl text-primary mb-1">{{ $resource->title }}</h3>
                        <p class="text-primary/40 uppercase tracking-widest text-[10px] font-black">{{ str_replace('_', ' ', $resource->category) }}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-8 border-t border-primary/5">
                    <div class="flex items-center gap-2 text-primary/40 text-xs font-bold uppercase tracking-widest">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        {{ $resource->download_count }} Downloads
                    </div>
                    <a href="{{ route('resources.download', $resource->id) }}" class="inline-flex items-center gap-3 text-primary font-black uppercase text-xs tracking-[0.2em] hover:text-accent transition-colors">
                        DOWNLOAD <span class="text-xl">↓</span>
                    </a>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Bottom CTA -->
<section class="bg-primary py-24 px-6 md:px-12 text-center text-white">
    <div class="max-w-4xl mx-auto">
        <h2 class="font-serif font-bold text-4xl mb-8">Looking for specific prep material?</h2>
        <p class="text-white/60 mb-10 text-lg">Our mentors can provide personalized study plans and reference materials based on your entry type.</p>
        <a href="{{ route('contact') }}" class="inline-block border-2 border-accent text-accent px-10 py-4 rounded font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">REQUEST PERSONALIZED MATERIAL</a>
    </div>
</section>
@endsection
