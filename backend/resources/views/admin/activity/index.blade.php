@extends('layouts.admin')

@section('header', 'System Activity Logs')

@section('content')
<div class="space-y-8">
    <div>
        <h3 class="text-gray-500 font-bold uppercase tracking-widest text-xs">Administrative Audit Trail</h3>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th class="px-8 py-4">Event / Action</th>
                        <th class="px-8 py-4">Module / Subject</th>
                        <th class="px-8 py-4">Administrator</th>
                        <th class="px-8 py-4">Changes</th>
                        <th class="px-8 py-4 text-right">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @foreach($activities as $activity)
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-8 py-4">
                            @php
                                $eventColors = [
                                    'created' => 'bg-green-100 text-green-600',
                                    'updated' => 'bg-blue-100 text-blue-600',
                                    'deleted' => 'bg-red-100 text-red-600'
                                ];
                            @endphp
                            <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest {{ $eventColors[$activity->description] ?? 'bg-gray-100' }}">
                                {{ $activity->description }}
                            </span>
                        </td>
                        <td class="px-8 py-4">
                            <p class="text-xs font-bold text-gray-800">{{ class_basename($activity->subject_type) }}</p>
                            <p class="text-[9px] text-gray-400 uppercase tracking-widest">ID: {{ $activity->subject_id }}</p>
                        </td>
                        <td class="px-8 py-4">
                            <p class="text-xs font-bold text-primary">{{ $activity->causer->name ?? 'System' }}</p>
                        </td>
                        <td class="px-8 py-4">
                            @if($activity->changes())
                                <div class="text-[10px] text-gray-500 space-y-1">
                                    @foreach($activity->changes()['attributes'] ?? [] as $key => $val)
                                        <p><span class="font-bold">{{ $key }}:</span> {{ Str::limit(is_array($val) ? json_encode($val) : $val, 30) }}</p>
                                    @endforeach
                                </div>
                            @else
                                <span class="text-[9px] text-gray-300 italic">No details</span>
                            @endif
                        </td>
                        <td class="px-8 py-4 text-right text-xs text-gray-400 font-medium">
                            {{ $activity->created_at->format('M d, H:i') }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-8">
        {{ $activities->links() }}
    </div>
</div>
@endsection
