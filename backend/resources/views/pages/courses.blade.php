@extends('layouts.app')

@section('title', 'Our Defence Training Programs — SSB Guide Aaryans Defence School')

@section('content')
<!-- Hero Section -->
<section class="relative h-[60vh] flex items-center justify-center bg-primary overflow-hidden">
    <div class="absolute inset-0 opacity-40">
        <img src="https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&q=80&w=1920" class="w-full h-full object-cover">
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
    <div class="relative z-10 text-center px-6">
        <span class="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Pratham Pag Program</span>
        <h1 class="font-serif font-black text-5xl md:text-6xl lg:text-7xl text-white mb-6">Our Defence <span class="text-accent">Training</span> Programs</h1>
        <p class="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            Six specialized courses built on the legacy of Aaryans World School — from Class 8 to Graduation and intensive SSB training by retired panel officers.
        </p>
    </div>
</section>

<!-- Course List -->
<section class="py-24 px-6 md:px-12 bg-surface">
    <div class="max-w-7xl mx-auto space-y-12">
        @foreach($courses as $index => $course)
        <div class="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col md:flex-row {{ $index % 2 != 0 ? 'md:flex-row-reverse' : '' }}"
             data-aos="{{ $index % 2 == 0 ? 'fade-right' : 'fade-left' }}">
            <!-- Visual Element -->
            <div class="md:w-1/3 bg-primary p-12 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div class="absolute top-8 left-8 text-white/5 font-serif font-black text-[10rem] select-none">
                    {{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}
                </div>
                <div class="relative z-10 w-24 h-24 bg-accent rounded-2xl flex items-center justify-center text-primary text-5xl shadow-2xl mb-8">
                     @if($course->icon_class == 'school') 🎓
                     @elseif($course->icon_class == 'military_tech') ⚔️
                     @elseif($course->icon_class == 'flight_takeoff') ✈️
                     @elseif($course->icon_class == 'groups') 👥
                     @elseif($course->icon_class == 'workspace_premium') 🏆
                     @else 🧠 @endif
                </div>
                <span class="relative z-10 text-white/40 font-serif text-6xl italic">{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span>
            </div>

            <!-- Content -->
            <div class="md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
                <p class="text-primary font-bold uppercase tracking-widest text-xs mb-4 border-l-4 border-accent pl-4">{{ $course->subtitle }}</p>
                <h2 class="font-serif font-bold text-3xl md:text-4xl text-primary mb-6">{{ $course->title }}</h2>
                <p class="text-textMain/70 text-lg leading-relaxed mb-10">
                    {{ $course->description }}
                </p>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                    @foreach($course->features as $feature)
                    <div class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0">✓</span>
                        <span class="text-textMain/80 font-medium">{{ $feature }}</span>
                    </div>
                    @endforeach
                </div>

                {{-- Course Fees Info --}}
                @if($course->fees)
                <div class="flex items-center gap-4 mb-8 p-5 bg-accent/10 rounded-2xl border border-accent/30">
                    <div class="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary text-xl shrink-0 shadow-md">₹</div>
                    <div>
                        <p class="text-primary/50 uppercase tracking-widest text-[10px] font-black mb-0.5">Course Fees</p>
                        <p class="text-primary font-black text-2xl tracking-tight">
                            ₹{{ number_format($course->fees, 0) }}
                            <span class="text-primary/40 font-medium text-sm ml-1">/ total</span>
                        </p>
                    </div>
                    <!-- <div class="ml-auto">
                        <span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">EMI Available</span>
                    </div> -->
                </div>
                @endif

                <div class="flex flex-wrap gap-4 pt-8 border-t border-primary/5">
                    <a href="{{ route('booking', ['course' => $course->id]) }}"
                       class="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all flex items-center gap-2">
                        🎯 BOOK NOW
                    </a>
                    <a href="{{ route('contact', ['course' => $course->id]) }}"
                       class="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                        ✉️ ENQUIRE
                    </a>
                    <a href="#"
                       class="border-2 border-primary/30 text-primary/60 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                        📄 BROCHURE
                    </a>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</section>

<!-- Footer CTA -->
<section class="bg-accent py-16 px-6 md:px-12 text-center">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        <h2 class="font-serif font-bold text-3xl text-primary">Not sure which programme fits you?</h2>
        <a href="{{ route('contact') }}" class="bg-primary text-white px-10 py-4 rounded font-bold uppercase tracking-widest hover:opacity-90 transition-all">
            TALK TO AN ADVISOR →
        </a>
    </div>
</section>
@endsection
