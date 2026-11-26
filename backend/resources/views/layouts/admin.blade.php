<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard — ADA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
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
    <style>
        [x-cloak] { display: none !important; }
        .sidebar-item-active {
            background: rgba(255, 217, 99, 0.1);
            border-left: 4px solid #ffd963;
            color: #ffd963;
        }
    </style>
</head>
<body class="bg-gray-50 font-sans text-gray-900" x-data="{ sidebarOpen: true }">

    <!-- Sidebar -->
    <aside :class="sidebarOpen ? 'w-64' : 'w-20'" class="fixed inset-y-0 left-0 bg-primary text-white transition-all duration-300 z-50 overflow-hidden flex flex-col shadow-2xl">
        <!-- Logo -->
        <div class="h-20 flex items-center px-6 bg-black/20 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-accent rounded flex items-center justify-center text-primary font-bold text-xl">A</div>
                <span x-show="sidebarOpen" class="font-bold tracking-wider text-lg" x-transition>ADA <span class="text-accent text-xs">ADMIN</span></span>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 py-6 space-y-1 overflow-y-auto">
            <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.dashboard') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">📊</span>
                <span x-show="sidebarOpen" x-transition>Dashboard</span>
            </a>
            <a href="{{ route('admin.hero.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.hero.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">🎬</span>
                <span x-show="sidebarOpen" x-transition>Hero Section</span>
            </a>
            <a href="{{ route('admin.media.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.media.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">📁</span>
                <span x-show="sidebarOpen" x-transition>Media Library</span>
            </a>
            <a href="{{ route('admin.courses.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.courses.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">📚</span>
                <span x-show="sidebarOpen" x-transition>Courses</span>
            </a>
            <a href="{{ route('admin.gallery.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.gallery.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">🖼️</span>
                <span x-show="sidebarOpen" x-transition>Gallery</span>
            </a>
            <a href="{{ route('admin.enquiries.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.enquiries.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">📝</span>
                <span x-show="sidebarOpen" x-transition>Enquiries</span>
            </a>

            @can('manage-users')
            <a href="{{ route('admin.users.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.users.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">👥</span>
                <span x-show="sidebarOpen" x-transition>Admin Users</span>
            </a>
            <a href="{{ route('admin.activity.index') }}" class="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition-colors {{ request()->routeIs('admin.activity.*') ? 'sidebar-item-active' : 'text-white/70' }}">
                <span class="text-xl">📜</span>
                <span x-show="sidebarOpen" x-transition>Activity Logs</span>
            </a>
            @endcan
        </nav>

        <!-- Footer -->
        <div class="p-4 bg-black/20 shrink-0">
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="w-full flex items-center gap-4 px-4 py-2 hover:bg-red-500/20 rounded transition-colors text-red-400">
                    <span class="text-xl">🚪</span>
                    <span x-show="sidebarOpen" x-transition>Logout</span>
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content -->
    <main :class="sidebarOpen ? 'pl-64' : 'pl-20'" class="transition-all duration-300 min-h-screen">
        <!-- Topbar -->
        <header class="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
            <div class="flex items-center gap-4">
                <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-gray-100 rounded transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <h2 class="text-xl font-semibold">@yield('header', 'Overview')</h2>
            </div>

            <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                    <p class="text-sm font-bold">{{ auth()->guard('admin')->user()->name }}</p>
                    <p class="text-xs text-gray-500">Administrator</p>
                </div>
                <div class="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold shadow-md">
                    {{ substr(auth()->guard('admin')->user()->name, 0, 1) }}
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <div class="p-8">
            @yield('content')
        </div>
    </main>

</body>
</html>
