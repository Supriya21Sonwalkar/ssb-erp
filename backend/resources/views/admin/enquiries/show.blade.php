@extends('layouts.admin')

@section('header', 'Enquiry Details')

@section('content')
<div class="max-w-4xl mx-auto space-y-8">
    <a href="{{ route('admin.enquiries.index') }}" class="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
        ← Back to list
    </a>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                <div class="flex justify-between items-start mb-12">
                    <div>
                        <h1 class="text-3xl font-black text-primary mb-2">{{ $enquiry->full_name }}</h1>
                        <p class="text-gray-500 font-medium">Applied for: <span class="text-primary font-bold">{{ $enquiry->course->title ?? $enquiry->course_interest ?? 'General' }}</span></p>
                    </div>
                    @if($enquiry->status === 'new')
                        <span class="px-4 py-2 bg-accent/20 text-primary text-xs font-bold rounded-full uppercase ring-1 ring-accent">New Enquiry</span>
                    @endif
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    <div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                        <p class="text-lg font-bold text-gray-800">{{ $enquiry->phone }}</p>
                        <a href="tel:{{ $enquiry->phone }}" class="text-xs text-primary font-bold hover:underline">Click to call</a>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</p>
                        <p class="text-lg font-bold text-gray-800">{{ $enquiry->email }}</p>
                        <a href="mailto:{{ $enquiry->email }}" class="text-xs text-primary font-bold hover:underline">Send email</a>
                    </div>
                </div>

                <div class="p-8 bg-surface rounded-2xl border border-primary/5">
                    <p class="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-4">Message from Candidate</p>
                    <p class="text-gray-700 leading-relaxed italic">
                        "{{ $enquiry->message ?? 'No message provided.' }}"
                    </p>
                </div>
            </div>

            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 class="font-bold text-gray-800 mb-6">Internal Notes & Progress</h3>
                <form action="{{ route('admin.enquiries.update', $enquiry) }}" method="POST" class="space-y-6">
                    @csrf @method('PUT')
                    
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Update Status</label>
                        <div class="flex flex-wrap gap-4">
                            <label class="flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all {{ $enquiry->status === 'new' ? 'border-accent bg-accent/5' : 'border-gray-100' }}">
                                <input type="radio" name="status" value="new" {{ $enquiry->status === 'new' ? 'checked' : '' }} class="hidden">
                                <span class="text-sm font-bold {{ $enquiry->status === 'new' ? 'text-primary' : 'text-gray-400' }}">New</span>
                            </label>
                            <label class="flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all {{ $enquiry->status === 'contacted' ? 'border-blue-400 bg-blue-50' : 'border-gray-100' }}">
                                <input type="radio" name="status" value="contacted" {{ $enquiry->status === 'contacted' ? 'checked' : '' }} class="hidden">
                                <span class="text-sm font-bold {{ $enquiry->status === 'contacted' ? 'text-blue-700' : 'text-gray-400' }}">Contacted</span>
                            </label>
                            <label class="flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all {{ $enquiry->status === 'closed' ? 'border-gray-400 bg-gray-50' : 'border-gray-100' }}">
                                <input type="radio" name="status" value="closed" {{ $enquiry->status === 'closed' ? 'checked' : '' }} class="hidden">
                                <span class="text-sm font-bold {{ $enquiry->status === 'closed' ? 'text-gray-700' : 'text-gray-400' }}">Closed</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Notes</label>
                        <textarea name="admin_notes" rows="6" placeholder="Add details about the conversation, parent feedback, or follow-up date..."
                                  class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all">{{ $enquiry->admin_notes }}</textarea>
                    </div>

                    <button type="submit" class="bg-primary text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl shadow-primary/20">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-8">
            <div class="bg-gray-900 rounded-3xl p-8 text-white">
                <h4 class="font-bold text-sm uppercase tracking-widest text-accent mb-6">Metadata</h4>
                <div class="space-y-6">
                    <div>
                        <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Received On</p>
                        <p class="font-medium">{{ $enquiry->created_at->format('d M, Y · h:i A') }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">IP Address</p>
                        <p class="font-mono text-xs">{{ $enquiry->ip_address ?? 'Unknown' }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Source</p>
                        <p class="font-medium text-xs">Direct Website Enquiry</p>
                    </div>
                </div>
            </div>

            <div class="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Danger Zone</p>
                <form action="{{ route('admin.enquiries.destroy', $enquiry) }}" method="POST" onsubmit="return confirm('Permanently delete this enquiry?')">
                    @csrf @method('DELETE')
                    <button type="submit" class="text-red-500 font-bold hover:text-red-700 transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2 mx-auto">
                        🗑️ Delete Permanently
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
