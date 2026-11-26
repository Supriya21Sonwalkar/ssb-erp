@extends('layouts.app')

@section('title', 'SSB Guide Aaryans Defence School — Home')

@section('content')
<!-- Section 1: Hero Slider -->
<section x-data="heroSlider()" x-init="init()" class="relative min-h-[110vh] md:h-screen overflow-hidden bg-primary">
    <!-- Cinematic Video Background -->
    <div class="absolute inset-0 z-0">
        <video autoplay muted loop playsinline class="w-full h-full object-cover brightness-75 contrast-110 scale-105">
            <source src="{{ asset($heroMedia->video_path ?? 'storage/new/Video1.mp4') }}" type="video/mp4">
        </video>
        <!-- Deep Maroon Brand Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent"></div>
        <!-- Vignette Effect for Depth -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
        <!-- Subtle Cinematic Scanline Overlay -->
        <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>

    <!-- Optional: Maintain the slide images as a fallback/layer if needed, 
         but the video will be the primary visual -->
    <template x-for="(image, index) in images" :key="index">
        <div x-show="current === index" 
             class="absolute inset-0 z-[1] pointer-events-none opacity-20 mix-blend-overlay">
            <img :src="image" class="w-full h-full object-cover ken-burns" alt="Hero Image">
        </div>
    </template>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-center pt-40 pb-24 px-6 md:px-12 lg:px-24">
        <div class="max-w-4xl" data-aos="fade-right" data-aos-delay="200">
            <div class="inline-flex items-center gap-2 border border-accent text-accent px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest mb-6 bg-primary/20 backdrop-blur-sm">
                <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                PRATHAM PAG · THE FIRST STEP
            </div>
            <h1 class="font-serif font-black text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight overflow-hidden">
                <div class="text-reveal">Prepare for</div>
                <div class="text-reveal" style="animation-delay: 0.2s">
                    <span class="text-accent bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">NDA, SSB, CDS</span>
                </div>
                <div class="text-reveal" style="animation-delay: 0.4s">& AFCAT</div>
            </h1>
            <p class="text-white/80 text-base md:text-lg font-medium max-w-2xl mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="400">
                SSB Guide Aaryans Defence School combines academic excellence, defence training and character development — building disciplined officers for a lifetime of service.
            </p>
            <div class="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="600">
                <a href="{{ route('courses') }}" class="bg-accent text-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-white/20 active:scale-95">
                    View Courses →
                </a>
                <button @click="videoModal = true" class="flex items-center gap-3 border-2 border-white/30 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-md group active:scale-95">
                    <span class="w-8 h-8 bg-accent text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-accent transition-colors">▶</span>
                    Watch Video
                </button>
            </div>
        </div>

        <!-- Video Modal -->
        <template x-teleport="body">
            <div x-show="videoModal" 
                 class="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 bg-primary/95 backdrop-blur-2xl"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="opacity-0"
                 x-transition:enter-end="opacity-100"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="opacity-100"
                 x-transition:leave-end="opacity-0">
                
                <!-- Header with Close/Home Button -->
                <div class="w-full max-w-6xl flex justify-end mb-4">
                    <a href="{{ url('/') }}" class="flex items-center gap-2 bg-accent text-primary px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg">
                        ✕ Close & Return Home
                    </a>
                </div>

                <!-- Video Container - Fixed height issues -->
                <div class="relative w-full max-w-6xl max-h-[75vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
                    <video x-show="videoModal" controls autoplay class="max-w-full max-h-full object-contain bg-black">
                        <source src="{{ asset($heroMedia->modal_video_path ?? $heroMedia->video_path ?? 'storage/new/Video1.mp4') }}" type="video/mp4">
                    </video>
                </div>
            </div>
        </template>

        <!-- Dots -->
        <div class="absolute bottom-12 left-6 md:left-12 lg:left-24 flex gap-4">
            <template x-for="(image, index) in images" :key="index">
                <button @click="goTo(index)" 
                        :class="current === index ? 'bg-accent w-12' : 'bg-white/40 w-4'"
                        class="h-1 rounded-full transition-all duration-300"></button>
            </template>
        </div>
    </div>
</section>

<!-- Section 2: Stats Bar -->
<section class="bg-primary py-10 px-6 md:px-12">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 text-center">
        <div class="text-white">
            <div class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-accent mb-1" data-countup data-target="10" data-suffix="+">0</div>
            <p class="text-[10px] md:text-xs uppercase tracking-widest opacity-60">Years Guiding Aspirants</p>
        </div>
        <div class="text-white">
            <div class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-accent mb-1">Retd.</div>
            <p class="text-[10px] md:text-xs uppercase tracking-widest opacity-60">SSB Panel Mentors</p>
        </div>
        <div class="text-white">
            <div class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-accent mb-1">Pune</div>
            <p class="text-[10px] md:text-xs uppercase tracking-widest opacity-60">Closest to NDA</p>
        </div>
        <div class="text-white">
            <div class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-accent mb-1" data-countup data-target="200" data-suffix="+">0</div>
            <p class="text-[10px] md:text-xs uppercase tracking-widest opacity-60">Cadets Recommended</p>
        </div>
        <div class="text-white">
            <div class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-accent mb-1" data-countup data-target="15" data-suffix="+">0</div>
            <p class="text-[10px] md:text-xs uppercase tracking-widest opacity-60">Years of Legacy</p>
        </div>
    </div>
</section>

<!-- Section 3: Our Programs -->
<section class="bg-surface py-20 px-6 md:px-12">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12" data-aos="fade-up">
            <span class="text-primary font-bold tracking-[0.2em] uppercase text-xs">Our Programs</span>
            <h2 class="font-serif font-bold text-3xl md:text-4xl mt-3 text-primary">Six pathways into the Indian Armed Forces</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            @foreach($courses as $index => $course)
            <div class="course-card bg-white p-6 md:p-8 rounded-xl shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-accent/30" 
                 data-aos="fade-up" 
                 data-aos-delay="{{ 100 * ($index % 3) }}">
                <div class="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-5 text-white text-2xl group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-primary/30 relative overflow-hidden">
                    <div class="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span class="material-icons relative z-10 group-hover:text-primary transition-colors">
                        @if($course->icon_class == 'school') 🎓
                        @elseif($course->icon_class == 'military_tech') ⚔️
                        @elseif($course->icon_class == 'flight_takeoff') ✈️
                        @elseif($course->icon_class == 'groups') 👥
                        @elseif($course->icon_class == 'workspace_premium') 🏆
                        @else 🧠 @endif
                    </span>
                </div>
                <h3 class="font-serif font-bold text-xl md:text-2xl mb-2 text-primary group-hover:text-primary transition-colors">{{ $course->title }}</h3>
                <p class="text-primary/60 text-[10px] font-bold uppercase tracking-widest mb-3">{{ $course->subtitle }}</p>
                <p class="text-textMain/70 mb-5 text-xs md:text-sm leading-relaxed">{{ $course->description }}</p>
                <a href="{{ route('courses') }}" class="inline-flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                    LEARN MORE <span class="text-accent group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Section 4: Why Choose Us -->
<section class="bg-surface py-24 px-6 md:px-12 border-t border-primary/5">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="text-center md:text-left" data-aos="fade-up" data-aos-delay="100">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 text-primary shadow-lg">
                    🛡️
                </div>
                <h4 class="font-bold text-xl mb-4 text-primary">Early & Honest Preparation</h4>
                <p class="text-textMain/70 text-sm leading-relaxed">No false promises. We start from the basics to build a foundation that lasts a lifetime.</p>
            </div>
            <div class="text-center md:text-left" data-aos="fade-up" data-aos-delay="200">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 text-primary shadow-lg">
                    🌟
                </div>
                <h4 class="font-bold text-xl mb-4 text-primary">Holistic Development</h4>
                <p class="text-textMain/70 text-sm leading-relaxed">Focus on personality, communication, and mindset along with academic excellence.</p>
            </div>
            <div class="text-center md:text-left" data-aos="fade-up" data-aos-delay="300">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 text-primary shadow-lg">
                    ⏰
                </div>
                <h4 class="font-bold text-xl mb-4 text-primary">Discipline & Routine</h4>
                <p class="text-textMain/70 text-sm leading-relaxed">A strictly residential program that instills the officer-like qualities from day one.</p>
            </div>
            <div class="text-center md:text-left" data-aos="fade-up" data-aos-delay="400">
                <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 text-primary shadow-lg">
                    🤝
                </div>
                <h4 class="font-bold text-xl mb-4 text-primary">Mentorship that Lasts</h4>
                <p class="text-textMain/70 text-sm leading-relaxed">Guided by retired SSB panel members who understand exactly what the armed forces seek.</p>
            </div>
        </div>
    </div>
</section>

<!-- Section 5: Our Mission -->
<section class="bg-primary py-24 px-6 md:px-12 text-white overflow-hidden">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div data-aos="fade-right">
            <h2 class="font-serif font-bold text-4xl md:text-5xl mb-8">Nurturing Leaders for a Meritocratic India.</h2>
            <p class="text-white/70 text-lg leading-relaxed mb-10">
                Our mission is to shape disciplined individuals into future officers. We combine the legacy of Aaryans World School with specialized defence training to create a pathway for students from Class 8 through post-graduation.
            </p>
            <a href="{{ route('about') }}" class="inline-block border-2 border-accent text-accent px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                Read Our Vision →
            </a>
        </div>
        <div class="grid grid-cols-2 gap-6" data-aos="zoom-in" data-aos-delay="200">
            <div class="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <div class="text-accent text-3xl mb-4">🎖️</div>
                <h5 class="font-bold text-xl mb-2">Discipline</h5>
                <p class="text-white/50 text-sm">The foundation of everything we do.</p>
            </div>
            <div class="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <div class="text-accent text-3xl mb-4">💎</div>
                <h5 class="font-bold text-xl mb-2">Integrity</h5>
                <p class="text-white/50 text-sm">Unwavering honesty in preparation.</p>
            </div>
            <div class="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <div class="text-accent text-3xl mb-4">🦁</div>
                <h5 class="font-bold text-xl mb-2">Courage</h5>
                <p class="text-white/50 text-sm">Facing challenges head-on.</p>
            </div>
            <div class="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <div class="text-accent text-3xl mb-4">🇮🇳</div>
                <h5 class="font-bold text-xl mb-2">Patriotism</h5>
                <p class="text-white/50 text-sm">Serving the nation with pride.</p>
            </div>
        </div>
    </div>
</section>

<!-- Section 6: Testimonials -->
<section x-data="testimonialSlider()" class="bg-white py-24 px-6 md:px-12 overflow-hidden">
    <div class="max-w-7xl mx-auto text-center mb-16">
        <h2 class="font-serif font-bold text-4xl md:text-5xl text-primary">Cadets recommended. Lives transformed.</h2>
    </div>

    <div class="relative max-w-5xl mx-auto">
        <div class="flex transition-transform duration-500 ease-in-out" :style="'transform: translateX(-' + (current * 100) + '%)'">
            @foreach($testimonials as $testimonial)
            <div class="w-full flex-shrink-0 px-4">
                <div class="bg-surface p-10 md:p-16 rounded-3xl relative">
                    <div class="absolute top-10 left-10 text-accent opacity-20 text-8xl font-serif italic">“</div>
                    <div class="relative z-10 text-center">
                        <p class="text-xl md:text-2xl text-primary italic leading-relaxed mb-10">
                            {{ $testimonial->quote }}
                        </p>
                        <div class="flex flex-col items-center">
                            <div class="w-20 h-20 rounded-full border-4 border-accent overflow-hidden mb-4">
                                @if($testimonial->photo_path)
                                    <img src="{{ asset($testimonial->photo_path) }}" class="w-full h-full object-cover">
                                @else
                                    <img src="https://ui-avatars.com/api/?name={{ urlencode($testimonial->cadet_name) }}&background=610e1e&color=fff" class="w-full h-full object-cover">
                                @endif
                            </div>
                            <h4 class="font-bold text-xl text-primary">{{ $testimonial->cadet_name }}</h4>
                            <p class="text-primary/60 uppercase tracking-widest text-xs font-bold">{{ $testimonial->entry_type }} · BATCH {{ $testimonial->batch_year }}</p>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        
        <!-- Navigation -->
        <button @click="prev()" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-20">←</button>
        <button @click="next()" class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-20">→</button>
    </div>
</section>

<!-- Section 7: CTA Banner -->
<section class="px-6 md:px-12 pb-24">
    <div class="max-w-7xl mx-auto bg-accent rounded-[2rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background: radial-gradient(circle at 20% 50%, rgba(97,14,30,0.5), transparent 50%)"></div>
        
        <div class="relative z-10 text-center md:text-left max-w-2xl">
            <h2 class="font-serif font-black text-4xl md:text-5xl text-primary mb-6 leading-tight">Book a free counselling session</h2>
            <p class="text-primary/70 text-lg font-medium">Understand the right pathway for your defence career. Our experts will guide you through NDA, SSB, and Graduation entries.</p>
        </div>
        
        <div class="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <a href="tel:+919823456789" class="font-bold text-primary text-xl flex items-center gap-3">
                <span class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">📞</span>
                +91 98234 56789
            </a>
            <a href="{{ route('contact') }}" class="bg-primary text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest shadow-2xl hover:bg-white hover:text-primary transition-all">
                BOOK COUNSELLING →
            </a>
        </div>
    </div>
</section>

@endsection

@push('scripts')
<script>
    function heroSlider() {
        return {
            current: 0,
            videoModal: false,
            images: [
                '/storage/new/WhatsApp Image 2026-04-08 at 11.27.25 AM.jpeg',
                '/storage/new/WhatsApp Image 2026-04-08 at 11.27.26 AM.jpeg',
                '/storage/new/WhatsApp Image 2026-04-08 at 11.28.04 AM (2).jpeg'
            ],
            interval: null,
            init() {
                this.interval = setInterval(() => this.next(), 6000);
            },
            next() {
                this.current = (this.current + 1) % this.images.length;
            },
            prev() {
                this.current = (this.current - 1 + this.images.length) % this.images.length;
            },
            goTo(i) {
                this.current = i;
                clearInterval(this.interval);
                this.init();
            }
        }
    }

    function testimonialSlider() {
        return {
            current: 0,
            count: {{ $testimonials->count() }},
            interval: null,
            init() {
                if (this.count > 1) {
                    this.interval = setInterval(() => this.next(), 4000);
                }
            },
            next() {
                this.current = (this.current + 1) % this.count;
            },
            prev() {
                this.current = (this.current - 1 + this.count) % this.count;
            }
        }
    }
</script>
@endpush
