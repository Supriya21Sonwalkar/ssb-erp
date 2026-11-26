<nav id="navbar" x-data="{ scrolled: false, open: false }" 
     @scroll.window="scrolled = window.scrollY > 50"
     :class="scrolled ? 'bg-primary/95 text-white backdrop-blur-md shadow-2xl py-2' : 'bg-white/80 text-primary backdrop-blur-sm py-3'"
     class="fixed w-full top-0 z-[100] transition-all duration-500 px-6 md:px-12 flex justify-between items-center">
    
    <!-- Logo -->
    <a href="{{ route('home') }}" class="flex items-center gap-3 group">
        <div :class="scrolled ? 'bg-white' : 'bg-transparent'" class="w-12 h-12 rounded-lg flex items-center justify-center p-1 transition-all duration-500 group-hover:scale-105">
             <img src="{{ asset('storage/new/SSB Logo.png') }}" alt="SSB Logo" class="w-full h-full object-contain">
        </div>
        <div>
            <h1 class="font-serif font-bold text-sm md:text-base leading-none">SSB Guide Aaryans Defence School</h1>
            <p class="text-[8px] uppercase tracking-widest opacity-80 mt-0.5">सेव परमो धर्मः</p>
        </div>
    </a>

    <!-- Desktop Menu -->
    <div class="hidden lg:flex items-center gap-6 font-semibold text-[12px] uppercase tracking-wider">
        <a href="{{ route('home') }}" class="transition-all py-1 {{ request()->routeIs('home') ? 'text-accent border-b-2 border-accent' : 'hover:border-b-2 hover:border-accent' }}">Home</a>
        <a href="{{ route('courses') }}" class="transition-all py-1 {{ request()->routeIs('courses') ? 'text-accent border-b-2 border-accent' : 'hover:border-b-2 hover:border-accent' }}">Courses</a>
        <a href="{{ route('about') }}" class="transition-all py-1 {{ request()->routeIs('about') ? 'text-accent border-b-2 border-accent' : 'hover:border-b-2 hover:border-accent' }}">About</a>
        <a href="{{ route('gallery') }}" class="transition-all py-1 {{ request()->routeIs('gallery') ? 'text-accent border-b-2 border-accent' : 'hover:border-b-2 hover:border-accent' }}">Gallery</a>
        <a href="{{ route('resources') }}" class="transition-all py-1 {{ request()->routeIs('resources') ? 'text-accent border-b-2 border-accent' : 'hover:border-b-2 hover:border-accent' }}">Resources</a>
        <a href="{{ route('contact') }}" class="transition-all py-1 {{ request()->routeIs('contact') ? 'text-accent border-b-2 border-accent' : 'hover:border-b-2 hover:border-accent' }}">Contact</a>
    </div>

    <!-- Right Side CTAs -->
    <div class="hidden lg:flex items-center gap-4">
        <a href="tel:+919823456789" class="flex items-center gap-2 hover:text-accent text-[11px] font-bold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span>CALL</span>
        </a>
        <a href="/student-registration" 
           :class="scrolled ? 'bg-accent text-primary' : 'bg-primary text-white'"
           class="px-5 py-2 rounded-lg font-bold uppercase text-[11px] tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95">
            REGISTER NOW
        </a>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="open = true" class="lg:hidden p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
    </button>

    <!-- Mobile Sidebar -->
    <div x-show="open" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="translate-x-full"
         x-transition:enter-end="translate-x-0"
         x-transition:leave="transition ease-in duration-300"
         x-transition:leave-start="translate-x-0"
         x-transition:leave-end="translate-x-full"
         class="fixed inset-y-0 right-0 w-80 bg-primary z-[60] shadow-2xl p-8 flex flex-col gap-8 text-accent font-bold text-xl"
         x-cloak>
        <div class="flex justify-between items-center mb-8">
            <span class="text-white opacity-50 uppercase tracking-widest text-xs">Menu</span>
            <button @click="open = false" class="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <a @click="open = false" href="{{ route('home') }}">Home</a>
        <a @click="open = false" href="{{ route('courses') }}">Courses</a>
        <a @click="open = false" href="{{ route('about') }}">About Us</a>
        <a @click="open = false" href="{{ route('gallery') }}">Gallery</a>
        <a @click="open = false" href="{{ route('resources') }}">Resources</a>
        <a @click="open = false" href="{{ route('contact') }}">Contact</a>
        <div class="mt-auto">
            <a @click="open = false" href="/student-registration" class="block w-full text-center bg-accent text-primary py-4 rounded text-lg uppercase tracking-widest">Register Now</a>
        </div>
    </div>
    
    <!-- Mobile Backdrop -->
    <div x-show="open" @click="open = false" class="fixed inset-0 bg-black/50 z-[55]" x-cloak></div>
</nav>
