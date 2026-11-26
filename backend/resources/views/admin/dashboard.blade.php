@extends('layouts.admin')

@section('header', 'Dashboard Overview')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
    <!-- Stat Card 1 -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl">📚</div>
        <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Courses</p>
            <h3 class="text-2xl font-black text-primary">{{ sprintf('%02d', $stats['courses']) }}</h3>
        </div>
    </div>

    <!-- Stat Card 2 -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-primary text-2xl">📝</div>
        <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Enquiries</p>
            <h3 class="text-2xl font-black text-primary">{{ sprintf('%02d', $stats['enquiries_new']) }}</h3>
        </div>
    </div>

    <!-- Stat Card 3 -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 text-2xl">🖼️</div>
        <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Gallery Items</p>
            <h3 class="text-2xl font-black text-primary">{{ sprintf('%02d', $stats['gallery']) }}</h3>
        </div>
    </div>

    <!-- Stat Card 4 -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 text-2xl">📁</div>
        <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Media Assets</p>
            <h3 class="text-2xl font-black text-primary">{{ sprintf('%02d', $stats['media']) }}</h3>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Recent Enquiries -->
    <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
            <h3 class="font-bold text-gray-800">Recent Enquiries</h3>
            <a href="{{ route('admin.enquiries.index') }}" class="text-xs font-bold text-primary uppercase tracking-widest hover:text-accent transition-colors">View All →</a>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th class="px-8 py-4">Name</th>
                        <th class="px-8 py-4">Course</th>
                        <th class="px-8 py-4">Date</th>
                        <th class="px-8 py-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($recentEnquiries as $enquiry)
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-8 py-4 font-medium">{{ $enquiry->full_name }}</td>
                        <td class="px-8 py-4 text-sm text-gray-600">{{ $enquiry->course_interest }}</td>
                        <td class="px-8 py-4 text-sm text-gray-500">{{ $enquiry->created_at->diffForHumans() }}</td>
                        <td class="px-8 py-4">
                            @php
                                $statusColors = [
                                    'new' => 'bg-accent/20 text-primary',
                                    'contacted' => 'bg-green-100 text-green-700',
                                    'closed' => 'bg-gray-100 text-gray-500'
                                ];
                            @endphp
                            <span class="px-3 py-1 {{ $statusColors[$enquiry->status] ?? 'bg-gray-100' }} text-[10px] font-bold rounded-full uppercase">
                                {{ $enquiry->status }}
                            </span>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="px-8 py-12 text-center text-gray-400 italic">No enquiries found</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="space-y-8">
        <div class="bg-primary rounded-3xl shadow-xl p-8 text-white">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <span class="text-accent">⚡</span> Quick Actions
            </h3>
            <div class="space-y-4">
                <a href="{{ route('admin.courses.create') }}" class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                    <span class="font-medium">Add New Course</span>
                    <span class="text-accent group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a href="{{ route('admin.gallery.create') }}" class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                    <span class="font-medium">Upload Gallery Photo</span>
                    <span class="text-accent group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a href="{{ route('admin.media.index') }}" class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                    <span class="font-medium">Media Manager</span>
                    <span class="text-accent group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 class="text-sm font-bold text-gray-800 mb-6 uppercase tracking-widest">Recent Activity</h3>
            <div class="space-y-6">
                @forelse($recentActivities as $activity)
                <div class="flex gap-4">
                    <div class="shrink-0 w-2 h-2 rounded-full mt-1.5 {{ $activity->description === 'created' ? 'bg-green-500' : ($activity->description === 'deleted' ? 'bg-red-500' : 'bg-blue-500') }}"></div>
                    <div>
                        <p class="text-xs font-bold text-gray-800">{{ $activity->causer->name ?? 'System' }} <span class="font-normal text-gray-500">{{ $activity->description }}</span> {{ class_basename($activity->subject_type) }}</p>
                        <p class="text-[10px] text-gray-400 mt-0.5">{{ $activity->created_at->diffForHumans() }}</p>
                    </div>
                </div>
                @empty
                <p class="text-xs text-gray-400 italic">No recent activity</p>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection
