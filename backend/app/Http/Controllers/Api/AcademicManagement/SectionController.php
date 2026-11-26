<?php

namespace App\Http\Controllers\Api\AcademicManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;

class SectionController extends Controller
{
    /**
     * Display Active Sections
     */
    public function index()
    {
        $sections = Section::with('class')
                    ->where('status', 1)
                    ->orderBy('section_name')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    /**
     * Display Sections by Class
     */
    public function getByClass($classId)
    {
        $sections = Section::where('class_id', $classId)
                    ->where('status', 1)
                    ->orderBy('section_name')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    /**
     * Store Section
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_id'      => 'required|exists:classes,id',
            'section_name'  => 'required|string|max:20',
            'room_number'   => 'nullable|string|max:255',
            'capacity'      => 'nullable|integer|min:1',
            'created_by'    => 'nullable|integer',
        ]);

        $exists = Section::where('class_id', $request->class_id)
            ->where('section_name', $request->section_name)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Section already exists for this class.',
                'errors' => [
                    'section_name' => ['Section already exists for this class.']
                ]
            ], 422);
        }

        $section = Section::create([
            'class_id'      => $request->class_id,
            'section_name'  => $request->section_name,
            'room_number'   => $request->room_number,
            'capacity'      => $request->capacity,
            'status'        => 1,
            'created_by'    => $request->created_by,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Section created successfully.',
            'data' => $section
        ], 201);
    }

    /**
     * Show Single Section
     */
    public function show($id)
    {
        $section = Section::with('class')->find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $section
        ]);
    }

    /**
     * Update Section
     */
    public function update(Request $request, $id)
    {
        $section = Section::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found.'
            ], 404);
        }

        $request->validate([
            'class_id'      => 'required|exists:classes,id',
            'section_name'  => 'required|string|max:20',
            'room_number'   => 'nullable|string|max:255',
            'capacity'      => 'nullable|integer|min:1',
        ]);

        $exists = Section::where('class_id', $request->class_id)
            ->where('section_name', $request->section_name)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Section already exists for this class.',
                'errors' => [
                    'section_name' => ['Section already exists for this class.']
                ]
            ], 422);
        }

        $section->update([
            'class_id'      => $request->class_id,
            'section_name'  => $request->section_name,
            'room_number'   => $request->room_number,
            'capacity'      => $request->capacity,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Section updated successfully.',
            'data' => $section
        ]);
    }

    /**
     * Inactive (Soft Delete)
     */
    public function destroy($id)
    {
        $section = Section::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found.'
            ], 404);
        }

        $section->update([
            'status' => 0
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Section moved to inactive successfully.'
        ]);
    }

    /**
     * Display Inactive Sections
     */
    public function inactive()
    {
        $sections = Section::with('class')
                    ->where('status', 0)
                    ->orderBy('section_name')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    /**
     * Restore Section
     */
    public function restore($id)
    {
        $section = Section::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found.'
            ], 404);
        }

        $section->update([
            'status' => 1
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Section restored successfully.'
        ]);
    }
}