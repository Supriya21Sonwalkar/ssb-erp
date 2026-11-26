<?php

namespace App\Http\Controllers\Api\AcademicManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AcademicYear;

class AcademicYearController extends Controller
{
    /**
     * Display all active academic years.
     */
    public function index()
    {
        $academicYears = AcademicYear::where('status', 1)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Academic Years fetched successfully.',
            'data' => $academicYears
        ]);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(Request $request)
    {
        $request->validate([
            'academic_year' => 'required|unique:academic_years,academic_year',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after:start_date',
            'is_current'    => 'required|boolean'
        ]);

        if ($request->is_current == 1) {
            AcademicYear::query()->update([
                'is_current' => 0
            ]);
        }

        $academicYear = AcademicYear::create([
            'academic_year' => $request->academic_year,
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'is_current'    => $request->is_current,
            'status'        => 1,
            'created_by'    => $request->created_by
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Academic Year created successfully.',
            'data' => $academicYear
        ], 201);
    }

    /**
     * Display single academic year.
     */
    public function show($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'status' => false,
                'message' => 'Academic Year not found.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $academicYear
        ]);
    }

    /**
     * Update academic year.
     */
    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'status' => false,
                'message' => 'Academic Year not found.'
            ], 404);
        }

        $request->validate([
            'academic_year' => 'required|unique:academic_years,academic_year,' . $id,
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after:start_date',
            'is_current'    => 'required|boolean'
        ]);

        if ($request->is_current == 1) {
            AcademicYear::where('id', '!=', $id)
                ->update([
                    'is_current' => 0
                ]);
        }

        $academicYear->update([
            'academic_year' => $request->academic_year,
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'is_current'    => $request->is_current
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Academic Year updated successfully.',
            'data' => $academicYear
        ]);
    }

    /**
     * Display inactive academic years.
     */
    public function inactive()
    {
        $academicYears = AcademicYear::where('status', 0)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Inactive Academic Years fetched successfully.',
            'data' => $academicYears
        ]);
    }

    /**
     * Soft delete (Inactive)
     */
    public function destroy($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'status' => false,
                'message' => 'Academic Year not found.'
            ], 404);
        }

        $academicYear->update([
            'status' => 0
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Academic Year moved to inactive successfully.'
        ]);
    }

    /**
     * Restore inactive academic year.
     */
    public function restore($id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'status' => false,
                'message' => 'Academic Year not found.'
            ], 404);
        }

        $academicYear->update([
            'status' => 1
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Academic Year restored successfully.'
        ]);
    }
}