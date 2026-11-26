@extends('layouts.app')

@section('title', 'Built on Legacy. Committed to Service. — SSB Guide Aaryans Defence School')

@section('content')
<!-- Hero -->
<section class="relative pt-48 pb-32 px-6 md:px-12 bg-primary">
    <div class="max-w-7xl mx-auto text-center">
        <span class="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">About the Academy</span>
        <h1 class="font-serif font-black text-5xl md:text-7xl lg:text-8xl text-white mb-8">Built on legacy. <span class="text-accent">Driven</span> by purpose.</h1>
        <p class="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            SSB Guide Aaryans Defence School stands on the foundation of Aaryans World School — an institution committed to academic integrity, discipline, and the dreams of uniform.
        </p>
    </div>
</section>

<!-- Section 1: Origin Story -->
<section class="py-24 px-6 md:px-12 bg-white">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
            <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Origin</span>
            <h2 class="font-serif font-bold text-4xl text-primary mb-8 leading-tight">Future Officers, built today.</h2>
            <div class="space-y-6 text-textMain/70 text-lg leading-relaxed">
                <p>
                    SSB Guide Aaryans Defence School, built on the legacy of Aaryans World School, is dedicated to shaping disciplined individuals into future officers and leaders of the nation.
                </p>
                <p>
                    We recognize that preparation for the Indian Armed Forces starts early. Our unique curriculum integrates rigorous academics with the physical and mental demands of defence training, ensuring our cadets are ready for every challenge.
                </p>
            </div>
        </div>
        <div class="relative">
            <div class="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="{{ asset('storage/new/Gemini_Generated_Image_3s957z3s957z3s95.png') }}" class="w-full h-full object-cover">
            </div>
            <div class="absolute -bottom-10 -left-10 bg-accent p-10 rounded-[2rem] shadow-xl hidden md:block">
                <div class="text-primary font-serif font-black text-5xl mb-2">15+</div>
                <div class="text-primary font-bold uppercase tracking-widest text-xs">Years of Excellence</div>
            </div>
        </div>
    </div>
</section>

<!-- Section 2 & 3: Mission & Vision -->
<section class="bg-surface py-24 px-6 md:px-12">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-primary/5">
            <div class="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg">🎯</div>
            <h3 class="font-serif font-bold text-3xl text-primary mb-6">Our Mission</h3>
            <p class="text-textMain/70 text-lg leading-relaxed">
                Nurturing and developing students to serve a meritocratic India and inspire them to be just and ethical citizens. We aim to provide a conducive environment for holistic development through academic excellence, character building, and physical training.
            </p>
        </div>
        <div class="bg-white p-12 rounded-[2.5rem] shadow-sm border border-primary/5">
            <div class="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg">👁️</div>
            <h3 class="font-serif font-bold text-3xl text-primary mb-6">Our Vision</h3>
            <p class="text-textMain/70 text-lg leading-relaxed">
                To be a premier institution that transforms young aspirants into disciplined, courageous, and patriotic leaders who are ready to lead the nation's armed forces with integrity and honor. We envision a future where every Aaryan cadet embodies the spirit of "Seva Parmo Dharmah".
            </p>
        </div>
    </div>
</section>

<!-- Section 4: Pull Quote -->
<section class="bg-primary py-24 px-6 md:px-12 text-center relative overflow-hidden">
    <div class="max-w-5xl mx-auto relative z-10">
        <h2 class="font-serif italic font-bold text-3xl md:text-5xl text-accent leading-tight">
            "Nurturing and developing students to serve a meritocratic India and inspire them to be just and ethical citizens."
        </h2>
    </div>
    <div class="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
         <img src="https://img.icons8.com/color/480/shield.png" class="w-1/2">
    </div>
</section>

<!-- Section 5: Ultimate Aim -->
<section class="bg-surface py-24 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">The Path Ahead</span>
            <h2 class="font-serif font-bold text-4xl text-primary">Comprehensive Exam Coverage</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @foreach(['NDA', 'Indian Navy (Tech)', 'Indian Army (Tech)', 'Air Force', 'Indian Navy', 'NCC Special Entry', 'JEE Technical Entry', 'AFCAT'] as $exam)
            <div class="bg-white py-6 px-8 rounded-xl text-center shadow-sm border border-primary/5 hover:border-accent hover:scale-105 transition-all">
                <p class="font-bold text-primary">{{ $exam }}</p>
            </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Section 6: Four Values -->
<section class="py-24 px-6 md:px-12 bg-white">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="text-center">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h4 class="font-bold text-xl mb-2 text-primary">Discipline</h4>
                <p class="text-textMain/70 text-sm">The cornerstone of our academy life.</p>
            </div>
            <div class="text-center">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                </div>
                <h4 class="font-bold text-xl mb-2 text-primary">Integrity</h4>
                <p class="text-textMain/70 text-sm">Moral uprightness in every action.</p>
            </div>
            <div class="text-center">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="15" y2="21"/><line x1="19" y1="13" x2="21" y2="15"/><polyline points="13 4 21 12 19.5 13.5 11.5 5.5 13 4"/></svg>
                </div>
                <h4 class="font-bold text-xl mb-2 text-primary">Courage</h4>
                <p class="text-textMain/70 text-sm">Bravery to face any situation.</p>
            </div>
            <div class="text-center">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                </div>
                <h4 class="font-bold text-xl mb-2 text-primary">Patriotism</h4>
                <p class="text-textMain/70 text-sm">Devotion to the motherland.</p>
            </div>
        </div>
    </div>
</section>

<!-- Section 7: Faculty -->
<section class="bg-surface py-24 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="font-serif font-bold text-4xl text-primary">Our Leadership Team</h2>
            <p class="text-primary/60 mt-4">The visionaries behind SSB Guide Aaryans Defence School, committed to excellence in defence education and character building.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <!-- Faculty Card 1: Milind Ladge -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-primary/5 hover:border-accent/30">
                <div class="h-80 bg-primary/10 overflow-hidden relative">
                    <img src="{{ asset('storage/new/milind_ladge.jpeg') }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p class="text-white text-xs italic">"Building excellence on discipline."</p>
                    </div>
                </div>
                <div class="p-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative">
                    <div class="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                        🎖️
                    </div>
                    <h4 class="font-serif font-bold text-2xl mb-2">Milind Ladge</h4>
                    <p class="text-accent uppercase tracking-widest text-[10px] font-bold mb-4 group-hover:text-accent transition-colors">MD, Aaryans Group</p>
                    <p class="opacity-70 text-sm leading-relaxed">Building excellence in defence training on the pillars of discipline, experience, and innovation.</p>
                </div>
            </div>
            <!-- Faculty Card 4: Arpit Chaudhary -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-primary/5 hover:border-accent/30">
                <div class="h-80 bg-primary/10 overflow-hidden relative">
                    <img src="{{ asset('storage/new/arpit_chaudhary.jpeg') }}" class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p class="text-white text-xs italic">"Academic excellence & personality."</p>
                    </div>
                </div>
                <div class="p-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative">
                    <div class="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                        ⚔️
                    </div>
                    <h4 class="font-serif font-bold text-2xl mb-2">Arpit Chaudhary</h4>
                    <p class="text-accent uppercase tracking-widest text-[10px] font-bold mb-4 group-hover:text-accent transition-colors">Director, SSB GUIDE</p>
                    <p class="opacity-70 text-sm leading-relaxed">Focusing on academic excellence and the development of soft skills and personality for military candidates.</p>
                </div>
            </div>
            <!-- Faculty Card 5: Kartikey Chaudhary -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-primary/5 hover:border-accent/30">
                <div class="h-80 bg-primary/10 overflow-hidden relative">
                    <img src="{{ asset('storage/new/kartikey_chaudhary.jpeg') }}" class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p class="text-white text-xs italic">"Grooming character for SSB."</p>
                    </div>
                </div>
                <div class="p-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative">
                    <div class="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                        🎖️
                    </div>
                    <h4 class="font-serif font-bold text-2xl mb-2">Kartikey Chaudhary</h4>
                    <p class="text-accent uppercase tracking-widest text-[10px] font-bold mb-4 group-hover:text-accent transition-colors">Director, SSB GUIDE</p>
                    <p class="opacity-70 text-sm leading-relaxed">Grooming character and personality to make candidates acceptable at SSB Interviews and beyond.</p>
                </div>
            </div>
            <!-- Faculty Card 2: Pratik Ladge -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-primary/5 hover:border-accent/30">
                <div class="h-80 bg-primary/10 overflow-hidden relative">
                    <img src="{{ asset('storage/new/pratik_ladge.jpeg') }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p class="text-white text-xs italic">"Shaping the guardians of our nation."</p>
                    </div>
                </div>
                <div class="p-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative">
                    <div class="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                        🎓
                    </div>
                    <h4 class="font-serif font-bold text-2xl mb-2">Pratik Ladge</h4>
                    <p class="text-accent uppercase tracking-widest text-[10px] font-bold mb-4 group-hover:text-accent transition-colors">Director & CEO</p>
                    <p class="opacity-70 text-sm leading-relaxed">Dedicated to shaping the future guardians of our nation by focusing on character, discipline, and leadership.</p>
                </div>
            </div>
            <!-- Faculty Card 3: Pranav Ladge -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-primary/5 hover:border-accent/30">
                <div class="h-80 bg-primary/10 overflow-hidden relative">
                    <img src="{{ asset('storage/new/pranav_ladge.jpeg') }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <p class="text-white text-xs italic">"Bridging dreams and reality."</p>
                    </div>
                </div>
                <div class="p-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative">
                    <div class="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                        🚀
                    </div>
                    <h4 class="font-serif font-bold text-2xl mb-2">Pranav Ladge</h4>
                    <p class="text-accent uppercase tracking-widest text-[10px] font-bold mb-4 group-hover:text-accent transition-colors">Director & COO</p>
                    <p class="opacity-70 text-sm leading-relaxed">Harnessing the power of discipline to bridge the gap between dreams and reality for every aspiring leader.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="bg-primary py-24 px-6 md:px-12 text-center text-white">
    <div class="max-w-4xl mx-auto">
        <h2 class="font-serif font-bold text-4xl md:text-5xl mb-8">Begin your <span class="text-accent">Pratham Pag</span> with us.</h2>
        <a href="{{ route('contact') }}" class="bg-accent text-primary px-12 py-5 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">TALK TO US TODAY →</a>
    </div>
</section>
@endsection
