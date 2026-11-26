<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#610e1e">
    <title>@yield('title', 'SSB Guide Aaryans Defence School — Pratham Pag')</title>
    <meta name="description" content="@yield('meta_description', 'SSB Guide Aaryans Defence School prepares students for NDA, SSB, CDS, AFCAT and more in Pune, Maharashtra.')">
    
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS (via CDN for simplicity in this demo) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#610e1e',
                        accent: '#ffd963',
                        surface: '#faf7f2',
                        textMain: '#1a1a1a',
                    },
                    fontFamily: {
                        serif: ['"Playfair Display"', 'serif'],
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        :root {
            --primary: #610e1e;
            --accent: #ffd963;
            --surface: #faf7f2;
            --white: #ffffff;
            --text: #1a1a1a;
        }

        [x-cloak] { display: none !important; }

        /* Remove horizontal scrollbar caused by AOS animations */
        body { overflow-x: hidden; }

        /* Noise Texture Overlay */
        .noise-overlay::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: url("https://grainy-gradients.vercel.app/noise.svg");
            opacity: 0.03;
            z-index: 9999;
            pointer-events: none;
            filter: contrast(150%) brightness(100%);
        }

        .navbar { transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1); }
        .navbar.scrolled { 
            background: rgba(97, 14, 30, 0.95);
            backdrop-filter: blur(10px);
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
            border-bottom: 1px solid rgba(255, 217, 99, 0.2);
        }

        /* Ken Burns Effect */
        @keyframes kenburns {
            0% { transform: scale(1) translate(0,0); }
            50% { transform: scale(1.1) translate(-1%, -1%); }
            100% { transform: scale(1) translate(0,0); }
        }
        .ken-burns { animation: kenburns 20s infinite alternate ease-in-out; }

        /* Text Reveal Mask */
        .text-reveal {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
            animation: revealUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes revealUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        /* Magnetic Button Utility */
        .magnetic { transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1); }

        /* Liquid Fill Button */
        .btn-liquid {
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        .btn-liquid::after {
            content: '';
            position: absolute;
            left: -100%; top: 0; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: all 0.6s ease;
            z-index: -1;
        }
        .btn-liquid:hover::after { left: 100%; }

        /* Smooth Scrolling */
        html { scroll-behavior: smooth; }

        /* Typography Enhancements */
        .font-serif { font-feature-settings: "swsh" 1, "cswh" 1; }
    </style>
    @stack('styles')
</head>
<body class="font-sans text-textMain bg-white noise-overlay">

    @include('partials.navbar')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')


    <script>
        // Count-Up Stats logic
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target, target = +el.dataset.target;
                    let start = 0, duration = 1500;
                    const step = ts => {
                        if (!start) start = ts;
                        const progress = Math.min((ts - start) / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 4);
                        el.textContent = Math.floor(ease * target) + (progress < 1 ? '' : el.dataset.suffix || '');
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        });
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('[data-countup]').forEach(el => observer.observe(el));
            
            // Initialize AOS
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });

            // Magnetic Buttons
            const magneticButtons = document.querySelectorAll('.magnetic');
            magneticButtons.forEach(btn => {
                btn.addEventListener('mousemove', function(e) {
                    const position = btn.getBoundingClientRect();
                    const x = e.pageX - position.left - position.width / 2;
                    const y = e.pageY - position.top - position.height / 2;
                    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
                });
                btn.addEventListener('mouseout', function(e) {
                    btn.style.transform = 'translate(0px, 0px)';
                });
            });
        });

        // Navbar Scroll Awareness
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 80);
            }
        });
    </script>
    @stack('scripts')
</body>
</html>
