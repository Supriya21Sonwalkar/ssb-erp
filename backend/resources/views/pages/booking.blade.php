@extends('layouts.app')

@section('title', 'Book Your Seat — SSB Guide Aaryans Defence School')

@section('content')
<!-- Hero -->
<section class="relative pt-48 pb-24 px-6 md:px-12 bg-primary overflow-hidden">
    <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-80 h-80 bg-accent rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
    </div>
    <div class="max-w-7xl mx-auto text-center relative z-10">
        <span class="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Secure Your Future</span>
        <h1 class="font-serif font-black text-5xl md:text-7xl text-white mb-8">Book <span class="text-accent">Your Seat</span></h1>
        <p class="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Fill in the details below to reserve your seat. Our admissions team will confirm your booking within 24 hours.
        </p>
    </div>
</section>

<!-- Booking Form Section -->
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

        <!-- Right: Booking Form -->
        <div>

        @if(session('success'))
        <div class="bg-green-50 border-2 border-green-200 text-green-700 p-8 rounded-2xl mb-12 flex items-center gap-6">
            <div class="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl shrink-0">✓</div>
            <div>
                <p class="font-black text-lg mb-1">Booking Received!</p>
                <p class="text-green-600 font-medium">{{ session('success') }}</p>
            </div>
        </div>
        @endif

        <div class="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-accent opacity-10 rounded-bl-full pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-28 h-28 bg-primary opacity-5 rounded-tr-full pointer-events-none"></div>

            <h2 class="font-serif font-bold text-3xl text-primary mb-2">Admission Booking Form</h2>
            <p class="text-textMain/50 text-sm mb-12">All fields marked <span class="text-red-500 font-bold">*</span> are required.</p>

            <form action="{{ route('booking.store') }}" method="POST" class="space-y-10">
                @csrf

                {{-- ── Section 1: Cadet Info ── --}}
                <div>
                    <h3 class="text-primary font-black uppercase tracking-widest text-xs border-l-4 border-accent pl-4 mb-6">Cadet Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="md:col-span-2">
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Full Name <span class="text-red-500">*</span></label>
                            <input type="text" name="full_name" required value="{{ old('full_name') }}"
                                   placeholder="Aaryan Singh"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('full_name') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Date of Birth</label>
                            <input type="date" name="date_of_birth" value="{{ old('date_of_birth') }}"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('date_of_birth') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Gender <span class="text-red-500">*</span></label>
                            <select name="gender" required class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer">
                                <option value="" disabled {{ old('gender') ? '' : 'selected' }}>Select gender...</option>
                                <option value="male"   {{ old('gender') == 'male'   ? 'selected' : '' }}>Male</option>
                                <option value="female" {{ old('gender') == 'female' ? 'selected' : '' }}>Female</option>
                                <option value="other"  {{ old('gender') == 'other'  ? 'selected' : '' }}>Other</option>
                            </select>
                            @error('gender') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                {{-- ── Section 2: Parent / Guardian ── --}}
                <div>
                    <h3 class="text-primary font-black uppercase tracking-widest text-xs border-l-4 border-accent pl-4 mb-6">Parent / Guardian Details</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Father's Name</label>
                            <input type="text" name="father_name" value="{{ old('father_name') }}"
                                   placeholder="Rajendra Singh"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('father_name') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Mother's Name</label>
                            <input type="text" name="mother_name" value="{{ old('mother_name') }}"
                                   placeholder="Sunita Singh"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('mother_name') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                {{-- ── Section 3: Contact ── --}}
                <div>
                    <h3 class="text-primary font-black uppercase tracking-widest text-xs border-l-4 border-accent pl-4 mb-6">Contact Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Phone <span class="text-red-500">*</span></label>
                            <input type="tel" name="phone" required value="{{ old('phone') }}"
                                   placeholder="+91 98234 56789"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('phone') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Email <span class="text-red-500">*</span></label>
                            <input type="email" name="email" required value="{{ old('email') }}"
                                   placeholder="you@example.com"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            @error('email') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                {{-- ── Section 4: Address ── --}}
                <div>
                    <h3 class="text-primary font-black uppercase tracking-widest text-xs border-l-4 border-accent pl-4 mb-6">Address</h3>
                    <div class="grid grid-cols-1 gap-8">
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Street Address</label>
                            <input type="text" name="address" value="{{ old('address') }}"
                                   placeholder="123 Defence Colony, Sector 5"
                                   class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">City</label>
                                <input type="text" name="city" value="{{ old('city') }}"
                                       placeholder="Pune"
                                       class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            </div>
                            <div>
                                <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">State</label>
                                <input type="text" name="state" value="{{ old('state') }}"
                                       placeholder="Maharashtra"
                                       class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">
                            </div>
                        </div>
                    </div>
                </div>

                {{-- ── Section 5: Course & Fees ── --}}
                <div>
                    <h3 class="text-primary font-black uppercase tracking-widest text-xs border-l-4 border-accent pl-4 mb-6">Course & Fees</h3>
                    <div class="grid grid-cols-1 gap-8">
                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Select Course <span class="text-red-500">*</span></label>
                            <select id="bkCourseSelect" name="course_id" required
                                    class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all appearance-none cursor-pointer">
                                <option value="" data-fees="">Choose a programme...</option>
                                @foreach($courses as $course)
                                <option value="{{ $course->id }}"
                                        data-fees="{{ $course->fees }}"
                                        {{ request('course') == $course->id ? 'selected' : '' }}>
                                    {{ $course->title }}
                                </option>
                                @endforeach
                            </select>
                            @error('course_id') <p class="text-red-500 text-xs mt-2 font-bold">{{ $message }}</p> @enderror
                        </div>

                        {{-- Auto-populated Fees display --}}
                        <div id="bkFeesWrapper" class="hidden">
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Course Fees</label>
                            <div class="flex items-center gap-5 bg-accent/10 border-2 border-accent/40 rounded-xl px-6 py-5">
                                <div class="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary text-xl font-black shrink-0 shadow-md">₹</div>
                                <div class="flex-1">
                                    <p class="text-primary/50 text-[10px] uppercase tracking-widest font-black mb-0.5">Total Fees</p>
                                    <p id="bkFeesDisplay" class="text-primary font-black text-2xl tracking-tight">—</p>
                                </div>
                                <button type="button" id="bkPayBtn"
                                        onclick="handleBookingPay()"
                                        class="bg-green-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-green-500 transition-all shadow-lg flex items-center gap-2 group">
                                    <span class="text-base group-hover:scale-110 transition-transform">💳</span>
                                    PAY NOW
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-primary/60 uppercase tracking-widest text-[10px] font-black mb-3">Additional Message</label>
                            <textarea name="message" rows="3"
                                      placeholder="Tell us about the cadet — current class, goals, any questions..."
                                      class="w-full bg-surface border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent transition-all">{{ old('message') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- ── Submit ── --}}
                <button type="submit"
                        class="w-full bg-primary text-white py-6 rounded-xl font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-xl group text-lg">
                    CONFIRM BOOKING
                    <span class="inline-block group-hover:translate-x-2 transition-transform ml-2">🎯</span>
                </button>
            </form>
        </div>{{-- /.bg-white card --}}

<script>
    const bkCourseSelect = document.getElementById('bkCourseSelect');
    const bkFeesWrapper  = document.getElementById('bkFeesWrapper');
    const bkFeesDisplay  = document.getElementById('bkFeesDisplay');

    function updateBookingFees() {
        const selected = bkCourseSelect.options[bkCourseSelect.selectedIndex];
        const fees = selected.dataset.fees;
        if (fees && fees !== '') {
            const formatted = new Intl.NumberFormat('en-IN').format(parseFloat(fees));
            bkFeesDisplay.textContent = '₹' + formatted;
            bkFeesWrapper.classList.remove('hidden');
        } else {
            bkFeesDisplay.textContent = '—';
            bkFeesWrapper.classList.add('hidden');
        }
    }

    function handleBookingPay() {
        const selected  = bkCourseSelect.options[bkCourseSelect.selectedIndex];
        const fees      = selected.dataset.fees;
        const courseName = selected.text;
        if (!fees || fees === '') {
            alert('Please select a course first to proceed with payment.');
            return;
        }
        alert('Redirecting to payment gateway for:\n' + courseName + '\nAmount: ₹' + new Intl.NumberFormat('en-IN').format(parseFloat(fees)));
        // TODO: Integrate with Razorpay / PayU / Cashfree etc.
    }

    bkCourseSelect.addEventListener('change', updateBookingFees);
    // Auto-run if course pre-selected via URL ?course=X
    updateBookingFees();
</script>

        </div>{{-- /.bg-white form card --}}
        </div>{{-- /.right col --}}
    </div>{{-- /.grid --}}
</section>
@endsection
