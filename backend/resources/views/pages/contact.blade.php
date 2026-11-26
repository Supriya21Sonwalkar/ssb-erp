@extends('layouts.app')

@section('title', 'Talk to our admissions team — SSB Guide Aaryans Defence School')

@section('content')
<!-- Hero -->
<section class="relative pt-48 pb-24 px-6 md:px-12 bg-primary">
    <div class="max-w-7xl mx-auto text-center md:text-left">
        <span class="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Admissions Open</span>
        <h1 class="font-serif font-black text-5xl md:text-7xl text-white mb-8">Talk to our <span class="text-accent">admissions</span> team</h1>
        <p class="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
            Share your details — an advisor will call you back to discuss the right programme, timeline and fees. No pressure, only clarity.
        </p>
    </div>
</section>

<!-- Content Grid -->
<section class="py-24 px-6 md:px-12 bg-surface">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        <!-- Left: Contact Info -->
        <div class="space-y-12">
            <div>
                <h2 class="font-serif font-bold text-3xl text-primary mb-10">Reach the Academy</h2>
                <div class="space-y-8">
                    <div class="flex items-start gap-6">
                        <div class="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shrink-0">📞</div>
                        <div>
                            <p class="text-primary/60 uppercase tracking-widest text-[10px] font-black mb-1">Phone</p>
                            <a href="tel:+919823456789" class="text-2xl font-bold text-primary">+91 98234 56789</a>
                        </div>
                    </div>
                    <div class="flex items-start gap-6">
                        <div class="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shrink-0">✉️</div>
                        <div>
                            <p class="text-primary/60 uppercase tracking-widest text-[10px] font-black mb-1">Email</p>
                            <a href="mailto:admissions@aaryansdefence.in" class="text-2xl font-bold text-primary break-all">admissions@aaryansdefence.in</a>
                        </div>
                    </div>
                    <div class="flex items-start gap-6">
                        <div class="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shrink-0">📍</div>
                        <div>
                            <p class="text-primary/60 uppercase tracking-widest text-[10px] font-black mb-1">Branches</p>
                            <p class="text-2xl font-bold text-primary">Pune (HQ) · Ambala · Delhi NCR</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-accent rounded-3xl p-10 shadow-lg">
                <h3 class="font-bold text-2xl text-primary mb-4">Ready to join SSB Guide Aaryans Defence School?</h3>
                <p class="text-primary/70 mb-8 font-medium">Talk to our admissions team today — and take your Pratham Pag towards the uniform.</p>
                <div class="flex flex-wrap gap-4">
                    <a href="tel:+919823456789" class="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">
                        📞 CALL NOW
                    </a>
                    <a href="https://wa.me/919823456789" target="_blank" class="bg-white text-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                        💬 CHAT ON WHATSAPP
                    </a>
                </div>
            </div>

            <div class="rounded-3xl overflow-hidden shadow-2xl h-80 grayscale hover:grayscale-0 transition-all duration-700">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04360341777!2d73.78056637373859!3d18.524870607310534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43105d951336!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1714476000000!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>

        <!-- Right: Enquiry Form -->
        <div class="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-bl-full"></div>
            
            <h2 class="font-serif font-bold text-3xl text-primary mb-2">Enquiry Form</h2>
            <p class="text-textMain/50 text-sm mb-12">All fields marked * are required.</p>

            @if(session('success'))
            <div class="bg-green-50 border-2 border-green-200 text-green-700 p-8 rounded-2xl mb-12 flex items-center gap-6 animate-bounce">
                <div class="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shrink-0">✓</div>
                <p class="font-bold text-lg">{{ session('success') }}</p>
            </div>
            @endif

            <form action="{{ route('contact.store') }}" method="POST" class="space-y-8">
                @csrf
                <div class="grid grid-cols-1 gap-8">
                    <div>
                        <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Full Name *</label>
                        <input type="text" name="full_name" required placeholder="Aaryan Singh" class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                        @error('full_name') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Phone *</label>
                            <input type="tel" name="phone" required placeholder="+91 98234 56789" class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('phone') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Email *</label>
                            <input type="email" name="email" required placeholder="you@example.com" class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('email') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    <div>
                        <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Select Course *</label>
                        <select name="course_id" class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer">
                            <option value="">Choose a programme...</option>
                            @foreach($courses as $course)
                            <option value="{{ $course->id }}" {{ request('course') == $course->id ? 'selected' : '' }}>{{ $course->title }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Message</label>
                        <textarea name="message" rows="4" placeholder="Tell us about the cadet — class, age, goals..." class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all"></textarea>
                    </div>
                </div>

                <button type="submit" class="w-full bg-primary text-white py-6 rounded-xl font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-xl group">
                    SEND ENQUIRY
                    <span class="inline-block group-hover:translate-x-2 transition-transform ml-2">✈️</span>
                </button>
            </form>
        </div>
    </div>
</section>
@endsection
