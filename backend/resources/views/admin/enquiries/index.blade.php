@extends('layouts.admin')

@section('header', 'Manage Enquiries')

@section('content')
<div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header & Filters -->
    <div class="p-8 border-b bg-gray-50/50">
        <form action="{{ route('admin.enquiries.index') }}" method="GET" class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-1">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Search</label>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Name, Email, Phone..." 
                       class="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all">
            </div>
            
            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Course</label>
                <select name="course_id" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all">
                    <option value="">All Courses</option>
                    @foreach($courses as $course)
                    <option value="{{ $course->id }}" {{ request('course_id') == $course->id ? 'selected' : '' }}>{{ $course->title }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select name="status" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all">
                    <option value="">All Status</option>
                    <option value="new" {{ request('status') == 'new' ? 'selected' : '' }}>New</option>
                    <option value="contacted" {{ request('status') == 'contacted' ? 'selected' : '' }}>Contacted</option>
                    <option value="closed" {{ request('status') == 'closed' ? 'selected' : '' }}>Closed</option>
                </select>
            </div>

            <div class="flex items-end gap-2">
                <button type="submit" class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-primary/10">Filter</button>
                <a href="{{ route('admin.enquiries.index') }}" class="bg-gray-100 text-gray-500 px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">Reset</a>
            </div>
        </form>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                    <th class="px-8 py-4">Ref #</th>
                    <th class="px-8 py-4">Candidate</th>
                    <th class="px-8 py-4">Course Interest</th>
                    <th class="px-8 py-4">Date</th>
                    <th class="px-8 py-4">Status</th>
                    <th class="px-8 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse($enquiries as $enquiry)
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-6 font-mono text-xs text-gray-400">#{{ str_pad($enquiry->id, 5, '0', STR_PAD_LEFT) }}</td>
                    <td class="px-8 py-6">
                        <p class="font-bold text-gray-800">{{ $enquiry->full_name }}</p>
                        <p class="text-xs text-gray-500">{{ $enquiry->email }} · {{ $enquiry->phone }}</p>
                    </td>
                    <td class="px-8 py-6">
                        <span class="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full uppercase">
                            {{ $enquiry->course->title ?? $enquiry->course_interest ?? 'General' }}
                        </span>
                    </td>
                    <td class="px-8 py-6 text-sm text-gray-500">
                        {{ $enquiry->created_at->format('d M, Y') }}
                        <p class="text-[10px]">{{ $enquiry->created_at->diffForHumans() }}</p>
                    </td>
                    <td class="px-8 py-6">
                        @if($enquiry->status === 'new')
                            <span class="px-3 py-1 bg-accent/20 text-primary text-[10px] font-bold rounded-full uppercase ring-1 ring-accent">New</span>
                        @elseif($enquiry->status === 'contacted')
                            <span class="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase ring-1 ring-blue-200">Contacted</span>
                        @else
                            <span class="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase ring-1 ring-gray-200">Closed</span>
                        @endif
                    </td>
                    <td class="px-8 py-6 text-right">
                        <div class="flex justify-end gap-2">
                            <a href="{{ route('admin.enquiries.show', $enquiry) }}" class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all shadow-sm">👁️</a>
                            <form action="{{ route('admin.enquiries.destroy', $enquiry) }}" method="POST" onsubmit="return confirm('Delete this enquiry?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑️</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-8 py-20 text-center">
                        <div class="max-w-xs mx-auto text-gray-400">
                            <p class="text-4xl mb-4">📭</p>
                            <p class="font-bold uppercase tracking-widest text-xs">No enquiries found</p>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    @if($enquiries->hasPages())
    <div class="px-8 py-6 bg-gray-50 border-t">
        {{ $enquiries->links() }}
    </div>
    @endif
</div>
@endsection
