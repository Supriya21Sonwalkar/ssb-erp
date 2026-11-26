<footer class="bg-primary text-white pt-4 pb-1 px-6 md:px-12 border-t border-white/10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 border-b border-white/5 pb-2">
        <!-- Brand Info -->
        <div>
            <div class="flex items-center gap-3 mb-2">
                <img src="{{ asset('storage/new/SSB Logo.png') }}" alt="SSB Logo" class="w-10 h-10 object-contain">
                <div>
                    <h2 class="font-serif font-bold text-lg leading-none text-white">SSB Guide Aaryans Defence School</h2>
                    <p class="text-[8px] uppercase tracking-widest text-accent mt-1 font-bold">सेव परमो धर्मः</p>
                </div>
            </div>
            <p class="text-white/60 text-[10px] leading-tight mb-2 max-w-sm">
                Building disciplined officers for the Indian Armed Forces through academic excellence, defence training,
                SSB preparation, and character development.
            </p>
            <div class="flex gap-2">
                <!-- Social Icons -->
                <a href="https://www.facebook.com/profile.php?id=61570769092096  " target="_blank" rel="noopener noreferrer"
                    class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </a>
                <a href="https://www.instagram.com/ssbguideaaryansdefenceschool?igsh=MTBna2NkOXd0djF3eQ==  " target="_blank" rel="noopener noreferrer"
                    class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer"
                    class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                </a>
            </div>
        </div>

        <!-- Explore Links -->
        <div>
            <h3 class="font-serif font-bold text-sm mb-1 border-b border-accent pb-0.5 inline-block">EXPLORE</h3>
            <ul class="space-y-1 font-medium text-[10px]">
                <li><a href="{{ route('courses') }}" class="hover:text-accent transition-colors">Our Courses</a></li>
                <li><a href="{{ route('about') }}" class="hover:text-accent transition-colors">About / Mission</a></li>
                <li><a href="{{ route('gallery') }}" class="hover:text-accent transition-colors">Gallery & Results</a>
                </li>
                <li><a href="{{ route('contact') }}" class="hover:text-accent transition-colors">Admissions</a></li>
                <li><a href="{{ route('resources') }}" class="hover:text-accent transition-colors">Resources</a></li>
            </ul>
        </div>

        <!-- Reach Us -->
        <div>
            <h3 class="font-serif font-bold text-sm mb-1 border-b border-accent pb-0.5 inline-block">REACH US</h3>
            <ul class="space-y-2">
                <li class="flex items-start gap-3">
                    <span class="text-accent text-sm">📞</span>
                    <div>
                        <p class="font-bold text-sm">+91 98234 56789</p>
                        <p class="text-white/60 text-[10px]">Mon-Sat (9:00 AM - 6:00 PM)</p>
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-accent text-sm">✉️</span>
                    <a href="mailto:admissions@aaryansdefence.in"
                        class="hover:text-accent transition-colors text-sm">admissions@aaryansdefence.in</a>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-accent text-sm">📍</span>
                    <p class="font-bold leading-snug text-xs">Pune, Maharashtra.</p>
                </li>
            </ul>
        </div>
    </div>
    <div class="mt-1 text-center text-white/30 text-[8px] tracking-widest uppercase flex flex-wrap justify-center gap-4">
        <p>© 2026 Powered By Aayojan AI. All rights reserved.</p>
        <a href="{{ route('admin.login') }}" class="hover:text-accent transition-colors underline underline-offset-4">Staff Login</a>
    </div>
</footer>