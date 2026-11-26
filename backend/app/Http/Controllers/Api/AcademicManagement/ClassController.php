<?php

namespace App\Http\Controllers\Api\AcademicManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Classes;

class ClassController extends Controller
{
    /**
     * Display Active Classes
     */
    public function index()
    {
        $classes = Classes::where('status', 1)
                    ->orderBy('display_order')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $classes
        ]);
    }

    /**
     * Store Class
     */
    public function store(Request $request)
    {
        $request->validate([
            // 'academic_year_id' => 'required|exists:academic_years,id',
            'class_name'       => 'required|string|max:100',
            'class_code'       => 'required|string|max:20|unique:classes,class_code',
            'display_order'    => 'nullable|integer',
            'created_by'       => 'nullable|integer',
        ]);

        $class = Classes::create([
            // 'academic_year_id' => $request->academic_year_id,
            'class_name'       => $request->class_name,
            'class_code'       => $request->class_code,
            'display_order'    => $request->display_order,
            'status'           => 1,
            'created_by'       => $request->created_by,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Class created successfully.',
            'data'    => $class
        ], 201);
    }

    /**
     * Show Single Class
     */
    public function show($id)
    {
        $class = Classes::find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $class
        ]);
    }

    /**
     * Update Class
     */
    public function update(Request $request, $id)
    {
        $class = Classes::find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found.'
            ], 404);
        }

        $request->validate([
            // 'academic_year_id' => 'required|exists:academic_years,id',
            'class_name'       => 'required|string|max:100',
            'class_code'       => 'required|string|max:20|unique:classes,class_code,' . $id,
            'display_order'    => 'nullable|integer',
            'updated_by'       => 'nullable|integer',
        ]);

        $class->update([
            // 'academic_year_id' => $request->academic_year_id,
            'class_name'       => $request->class_name,
            'class_code'       => $request->class_code,
            'display_order'    => $request->display_order,
            'updated_by'       => $request->updated_by,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Class updated successfully.',
            'data' => $class
        ]);
    }

    /**
     * Inactive (Soft Delete)
     */
    public function destroy($id)
    {
        $class = Classes::find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found.'
            ], 404);
        }

        $class->update([
            'status' => 0
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Class moved to inactive successfully.'
        ]);
    }

    /**
     * Inactive Classes
     */
    public function inactive()
    {
        $classes = Classes::where('status', 0)
                    ->orderBy('display_order')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $classes
        ]);
    }

    /**
     * Restore Class
     */
    public function restore($id)
    {
        $class = Classes::find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found.'
            ], 404);
        }

        $class->update([
            'status' => 1
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Class restored successfully.'
        ]);
    }
}   