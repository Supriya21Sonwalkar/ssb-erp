@extends('layouts.app')

@section('title', 'Success Stories & Training Life — SSB Guide Aaryans Defence School')

@section('content')
<!-- Hero -->
<section class="relative pt-40 pb-24 px-6 md:px-12 bg-primary overflow-hidden">
    <div class="absolute inset-0 opacity-10 pointer-events-none">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.1"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
        </svg>
    </div>
    <div class="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        <span class="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Gallery</span>
        <h1 class="font-serif font-black text-5xl md:text-7xl lg:text-8xl text-white mb-8">Success Stories & <span class="text-accent">Training</span> Life</h1>
        <p class="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            Disciplined mornings, classroom focus, GTO ground sweat and the moment a cadet earns their uniform — a glimpse of the journey we live every day.
        </p>
    </div>
</section>

<!-- Filter Tabs -->
<section x-data="{ active: 'all' }" class="bg-surface py-20 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap justify-center gap-4 mb-16" x-init="$watch('active', () => setTimeout(() => AOS.refresh(), 100))">
            <button @click="active = 'all'" :class="active === 'all' ? 'bg-primary text-white shadow-xl scale-105 border-accent' : 'bg-white text-primary border-primary/10 hover:bg-primary hover:text-white hover:scale-105'" class="px-8 py-3 rounded-full font-bold transition-all duration-300 border-2">All</button>
            @foreach($categories as $category)
            <button @click="active = '{{ $category->slug }}'" 
                    :class="active === '{{ $category->slug }}' ? 'bg-primary text-white shadow-xl scale-105 border-accent' : 'bg-white text-primary border-primary/10 hover:bg-primary hover:text-white hover:scale-105'" 
                    class="px-8 py-3 rounded-full font-bold transition-all duration-300 border-2">
                {{ $category->name }}
            </button>
            @endforeach
        </div>

        <!-- Masonry-like Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($galleryItems as $index => $item)
            <div x-show="active === 'all' || active === '{{ $item->category }}'" 
                 x-transition:enter="transition ease-out duration-500"
                 x-transition:enter-start="opacity-0 translate-y-12"
                 x-transition:enter-end="opacity-100 translate-y-0"
                 class="group relative aspect-square overflow-hidden rounded-2xl bg-primary/10 shadow-lg cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay="{{ 100 * ($index % 3) }}"
                  @click="$dispatch('open-lightbox', { img: '{{ asset($item->image_path) }}', title: '{{ addslashes($item->title) }}' })">
                
                <img src="{{ asset($item->image_path) }}" 
                     loading="lazy"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
            </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Result Highlights -->
<section class="bg-surface py-24 px-6 md:px-12 border-t border-primary/5">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm">Result Highlights</span>
            <h2 class="font-serif font-bold text-4xl md:text-5xl mt-4 text-primary">Proven results across NDA, SSB, CDS and AFCAT</h2>
            <p class="text-primary/60 mt-4">Student transformation through disciplined training — academics, fitness and personality, every single day.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white p-10 rounded-2xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="100">
                <h4 class="font-serif font-bold text-2xl text-primary mb-2">Holistic</h4>
                <p class="text-primary/60 text-xs font-bold uppercase tracking-widest">Academic + SSB + Fitness</p>
            </div>
            <div class="bg-white p-10 rounded-2xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="200">
                <h4 class="font-serif font-bold text-2xl text-primary mb-2">Residential</h4>
                <p class="text-primary/60 text-xs font-bold uppercase tracking-widest">Distraction-free campus</p>
            </div>
            <div class="bg-white p-10 rounded-2xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="300">
                <h4 class="font-serif font-bold text-2xl text-primary mb-2">Honest</h4>
                <p class="text-primary/60 text-xs font-bold uppercase tracking-widest">No false promises, real guidance</p>
            </div>
            <div class="bg-white p-10 rounded-2xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="400">
                <h4 class="font-serif font-bold text-2xl text-primary mb-2">Disciplined</h4>
                <p class="text-primary/60 text-xs font-bold uppercase tracking-widest">Defence-style daily routine</p>
            </div>
        </div>
    </div>
</section>

<!-- Director's Quote -->
<section class="bg-white py-24 px-6 md:px-12">
    <div class="max-w-5xl mx-auto">
        <div class="border-l-[12px] border-accent pl-8 md:pl-16 py-8 bg-surface rounded-r-3xl shadow-lg">
            <svg class="w-16 h-16 text-accent mb-8 opacity-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.895 14.912 16 16.017 16H19.017C19.569 16 20.017 15.552 20.017 15V9C20.017 8.448 19.569 8 19.017 8H16.017C14.912 8 14.017 7.105 14.017 6V3L20.017 3C21.122 3 22.017 3.895 22.017 5V15C22.017 16.105 21.122 17 20.017 17H17.017V21L14.017 21ZM5.017 21L5.017 18C5.017 16.895 5.912 16 7.017 16H10.017C10.569 16 11.017 15.552 11.017 15V9C11.017 8.448 10.569 8 10.017 8H7.017C5.912 8 5.017 7.105 5.017 6V3L11.017 3C12.122 3 13.017 3.895 13.017 5V15C13.017 16.105 12.122 17 11.017 17H8.017V21L5.017 21Z"/></svg>
            <h3 class="font-serif font-black text-2xl md:text-3xl lg:text-4xl text-primary leading-tight mb-8">
                “An officer is not made in the exam hall, but in daily habits, discipline and mindset. Our job is to build that mindset — the uniform follows.”
            </h3>
            <div class="flex items-center gap-4">
                <div class="w-12 h-1 px-4 bg-accent"></div>
                <p class="font-bold text-primary tracking-[0.2em] uppercase text-sm">SSB Guide Aaryans Defence School · Director’s Note</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Banner -->
<section class="bg-accent py-16 px-6 md:px-12 text-center">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        <h2 class="font-serif font-bold text-3xl text-primary">Become the next success story.</h2>
        <a href="{{ route('contact') }}" class="bg-primary text-white px-10 py-4 rounded font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 btn-liquid magnetic shadow-2xl">
            APPLY NOW <span class="text-xl">→</span>
        </a>
    </div>
</section>

<!-- Lightbox Modal -->
<div x-data="{ open: false, img: '', title: '' }" 
     @open-lightbox.window="open = true; img = $event.detail.img; title = $event.detail.title"
     @keydown.escape.window="open = false"
     x-show="open"
     x-cloak
     class="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-md p-6">
    <button @click="open = false" class="absolute top-10 right-10 text-white hover:text-accent transition-colors">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="max-w-5xl w-full text-center">
        <img :src="img" class="max-h-[80vh] mx-auto rounded-2xl shadow-[0_0_50px_rgba(255,217,99,0.3)] mb-6 border-4 border-accent/20">
        <h3 class="text-white font-serif text-3xl font-bold" x-text="title"></h3>
    </div>
</div>
@endsection
