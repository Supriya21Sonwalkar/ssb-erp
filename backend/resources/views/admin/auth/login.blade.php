<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — ADA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#610e1e',
                        accent: '#ffd963',
                        dark: '#1a1a1a',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-primary min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
    
    <!-- Background Accents -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-accent opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

    <div class="w-full max-w-md relative">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
            <div class="inline-flex w-16 h-16 bg-accent rounded-2xl items-center justify-center text-primary font-bold text-3xl shadow-2xl mb-6">A</div>
            <h1 class="text-white text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p class="text-white/60 mt-2">Sign in to manage ADA academy</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10 border border-white/10">
            <form action="{{ route('admin.login.submit') }}" method="POST" class="space-y-6">
                @csrf
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" name="email" value="{{ old('email') }}" required autofocus
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                           placeholder="admin@ada.com">
                    @error('email')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
                    <input type="password" name="password" required
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                           placeholder="••••••••">
                    @error('password')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer">
                        <span class="text-sm text-gray-600 group-hover:text-primary transition-colors">Remember me</span>
                    </label>
                    <a href="#" class="text-sm font-bold text-primary hover:text-accent transition-colors">Forgot Password?</a>
                </div>

                <button type="submit" class="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-primary/20">
                    Sign In →
                </button>
            </form>
        </div>

        <p class="text-center text-white/40 text-xs mt-10 tracking-widest uppercase">
            &copy; {{ date('Y') }} SSB Guide Aaryans Defence School
        </p>
    </div>
</body>
</html>
