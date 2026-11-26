<?php

namespace App\Http\Controllers\Api\AcademicManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    /**
     * Display Active Subjects
     */
    public function index()
    {
        $subjects = Subject::where('status', 1)
                    ->orderBy('display_order')
                    ->orderBy('subject_name')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $subjects
        ]);
    }

    /**
     * Store Subject
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject_name'   => 'required|string|max:100',
            'subject_code'   => 'required|string|max:20|unique:subjects,subject_code',
            'subject_type'   => 'required|in:Theory,Practical,Both',
            'description'    => 'nullable|string',
            'display_order'  => 'required|integer|min:1',
            'created_by'     => 'nullable|integer',
        ]);

        $exists = Subject::where('subject_name', $request->subject_name)
                    ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Subject already exists.'
            ], 422);
        }

        $subject = Subject::create([
            'subject_name'   => $request->subject_name,
            'subject_code'   => $request->subject_code,
            'subject_type'   => $request->subject_type,
            'description'    => $request->description,
            'display_order'  => $request->display_order,
            'status'         => 1,
            'created_by'     => $request->created_by,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject created successfully.',
            'data' => $subject
        ], 201);
    }

    /**
     * Show Single Subject
     */
    public function show($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subject
        ]);
    }

        /**
     * Update Subject
     */
    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found.'
            ], 404);
        }

        $request->validate([
            'subject_name'   => 'required|string|max:100',
            'subject_code'   => 'required|string|max:20|unique:subjects,subject_code,' . $id,
            'subject_type'   => 'required|in:Theory,Practical,Both',
            'description'    => 'nullable|string',
            'display_order'  => 'required|integer|min:1',
        ]);

        $exists = Subject::where('subject_name', $request->subject_name)
                    ->where('id', '!=', $id)
                    ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Subject already exists.'
            ], 422);
        }

        $subject->update([
            'subject_name'   => $request->subject_name,
            'subject_code'   => $request->subject_code,
            'subject_type'   => $request->subject_type,
            'description'    => $request->description,
            'display_order'  => $request->display_order,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject updated successfully.',
            'data' => $subject
        ]);
    }

    /**
     * Inactive (Soft Delete)
     */
    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found.'
            ], 404);
        }

        $subject->update([
            'status' => 0
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject moved to inactive successfully.'
        ]);
    }

    /**
     * Display Inactive Subjects
     */
    public function inactive()
    {
        $subjects = Subject::where('status', 0)
                    ->orderBy('display_order')
                    ->orderBy('subject_name')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $subjects
        ]);
    }

    /**
     * Restore Subject
     */
    public function restore($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found.'
            ], 404);
        }

        $subject->update([
            'status' => 1
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject restored successfully.'
        ]);
    }
}