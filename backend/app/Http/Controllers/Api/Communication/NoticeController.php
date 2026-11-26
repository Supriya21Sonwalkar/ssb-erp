<?php

namespace App\Http\Controllers\Api\Communication;

use App\Http\Controllers\Controller;
use App\Models\CommunicationNotice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NoticeController extends Controller
{
    /**
     * Get active notices
     */
    public function index(Request $request)
    {
        $query = CommunicationNotice::query()
            ->where('is_active', true);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('notice_no', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Notice Type
        if ($request->filled('notice_type')) {
            $query->where('notice_type', $request->notice_type);
        }

        // Priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Target
        if ($request->filled('target_type')) {
            $query->where('target_type', $request->target_type);
        }

        // Publish Date From
        if ($request->filled('from_date')) {
            $query->whereDate(
                'publish_date',
                '>=',
                $request->from_date
            );
        }

        // Publish Date To
        if ($request->filled('to_date')) {
            $query->whereDate(
                'publish_date',
                '<=',
                $request->to_date
            );
        }

        $notices = $query
            ->orderByDesc('publish_date')
            ->orderByDesc('id')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $notices,
        ]);
    }


    /**
     * Get inactive notices
     */
    public function inactive(Request $request)
    {
        $query = CommunicationNotice::query()
            ->where('is_active', false);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('notice_no', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        $notices = $query
            ->orderByDesc('id')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $notices,
        ]);
    }


    /**
     * Create notice
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'notice_no' => [
                'required',
                'string',
                'max:50',
                'unique:communication_notices,notice_no',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'notice_type' => [
                'required',
                'string',
                'max:50',
            ],

            'priority' => [
                'required',
                'in:Normal,Important,Urgent',
            ],

            'publish_date' => [
                'required',
                'date',
            ],

            'expiry_date' => [
                'nullable',
                'date',
                'after_or_equal:publish_date',
            ],

            'attachment' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
                'max:10240',
            ],

            'target_type' => [
                'required',
                'string',
                'max:50',
            ],
        ]);

        // Upload attachment
        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request
                ->file('attachment')
                ->store(
                    'communication/notices',
                    'public'
                );
        }

        $validated['is_active'] = true;

        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        $notice = CommunicationNotice::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Notice created successfully.',
            'data' => $notice,
        ], 201);
    }


    /**
     * Get single notice
     */
    public function show($id)
    {
        $notice = CommunicationNotice::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $notice,
        ]);
    }


    /**
     * Update notice
     */
    public function update(Request $request, $id)
    {
        $notice = CommunicationNotice::findOrFail($id);

        $validated = $request->validate([
            'notice_no' => [
                'required',
                'string',
                'max:50',
                'unique:communication_notices,notice_no,' . $id,
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'notice_type' => [
                'required',
                'string',
                'max:50',
            ],

            'priority' => [
                'required',
                'in:Normal,Important,Urgent',
            ],

            'publish_date' => [
                'required',
                'date',
            ],

            'expiry_date' => [
                'nullable',
                'date',
                'after_or_equal:publish_date',
            ],

            'attachment' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
                'max:10240',
            ],

            'target_type' => [
                'required',
                'string',
                'max:50',
            ],
        ]);

        // Replace attachment if new one uploaded
        if ($request->hasFile('attachment')) {

            if ($notice->attachment) {
                Storage::disk('public')
                    ->delete($notice->attachment);
            }

            $validated['attachment'] = $request
                ->file('attachment')
                ->store(
                    'communication/notices',
                    'public'
                );
        }

        $validated['updated_by'] = auth()->id();

        $notice->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Notice updated successfully.',
            'data' => $notice->fresh(),
        ]);
    }


    /**
     * Deactivate notice
     */
    public function destroy($id)
    {
        $notice = CommunicationNotice::findOrFail($id);

        $notice->update([
            'is_active' => false,
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notice moved to inactive successfully.',
        ]);
    }


    /**
     * Restore notice
     */
    public function restore($id)
    {
        $notice = CommunicationNotice::findOrFail($id);

        $notice->update([
            'is_active' => true,
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notice restored successfully.',
        ]);
    }
}