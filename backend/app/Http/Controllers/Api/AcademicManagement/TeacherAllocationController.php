<?php

namespace App\Http\Controllers\Api\AcademicManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\TeacherAllocation;
use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Subject;
use App\Models\Employee;
use App\Models\ClassSubject;

class TeacherAllocationController extends Controller
{
    /**
     * Display Listing
     */
    public function index()
    {
        $allocations = TeacherAllocation::with([
            'academicYear',
            'class',
            'subject',
            'employee'
        ])
        ->where('status', 1)
        ->orderBy('academic_year_id')
        ->orderBy('class_id')
        ->orderBy('employee_id')
        ->get();

        $grouped = $allocations
            ->groupBy(function ($item) {
                return $item->academic_year_id . '_' .
                       $item->class_id . '_' .
                       $item->employee_id;
            })
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'id' => $first->id,
                    'academic_year_id' => $first->academic_year_id,
                    'class_id' => $first->class_id,
                    'employee_id' => $first->employee_id,
                    'status' => $first->status,
                    'academicYear' => $first->academicYear,
                    'class' => $first->class,
                    'employee' => $first->employee,
                    'subjects' => $items->pluck('subject'),
                    'created_at' => $first->created_at,
                    'updated_at' => $first->updated_at,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $grouped
        ]);
    }

    /**
     * Store
     */
    public function store(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'required|exists:classes,id',
            'employee_id' => 'required|exists:employees,id',
            'subjects' => 'required|array|min:1',
            'subjects.*' => 'exists:subjects,id',
        ], [
            'academic_year_id.required' => 'Please select Academic Year.',
            'class_id.required' => 'Please select Class.',
            'employee_id.required' => 'Please select Teacher.',
            'subjects.required' => 'Please select at least one Subject.',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->subjects as $subjectId) {
                $exists = TeacherAllocation::where('academic_year_id', $request->academic_year_id)
                    ->where('class_id', $request->class_id)
                    ->where('subject_id', $subjectId)
                    ->where('status', 1)
                    ->first();

                if ($exists) {
                    return response()->json([
                        'success' => false,
                        'message' => $exists->subject->subject_name . ' is already allocated to another teacher.'
                    ], 422);
                }

                TeacherAllocation::create([
                    'academic_year_id' => $request->academic_year_id,
                    'class_id' => $request->class_id,
                    'subject_id' => $subjectId,
                    'employee_id' => $request->employee_id,
                    'status' => 1,
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Teacher Allocation saved successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show
     */
    public function show($id)
    {
        $allocation = TeacherAllocation::findOrFail($id);

        $allocations = TeacherAllocation::with([
            'academicYear',
            'class',
            'subject',
            'employee'
        ])
        ->where('academic_year_id', $allocation->academic_year_id)
        ->where('class_id', $allocation->class_id)
        ->where('employee_id', $allocation->employee_id)
        ->where('status', 1)
        ->get();

        if ($allocations->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher Allocation not found.'
            ], 404);
        }

        $first = $allocations->first();
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $first->id,
                'academic_year_id' => $first->academic_year_id,
                'class_id' => $first->class_id,
                'employee_id' => $first->employee_id,
                'status' => $first->status,
                'academicYear' => $first->academicYear,
                'class' => $first->class,
                'employee' => $first->employee,
                'subjects' => $allocations->pluck('subject_id'),
                'subject_details' => $allocations->pluck('subject'),
                'created_at' => $first->created_at,
                'updated_at' => $first->updated_at,
            ]
        ]);
    }

    /**
     * Update
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'required|exists:classes,id',
            'employee_id' => 'required|exists:employees,id',
            'subjects' => 'required|array|min:1',
            'subjects.*' => 'exists:subjects,id',
        ], [
            'academic_year_id.required' => 'Please select Academic Year.',
            'class_id.required' => 'Please select Class.',
            'employee_id.required' => 'Please select Teacher.',
            'subjects.required' => 'Please select at least one Subject.',
        ]);

        DB::beginTransaction();
        try {
            $oldAllocation = TeacherAllocation::findOrFail($id);

            // Remove Previous Allocation Group
            TeacherAllocation::where('academic_year_id', $oldAllocation->academic_year_id)
                ->where('class_id', $oldAllocation->class_id)
                ->where('employee_id', $oldAllocation->employee_id)
                ->delete();

            // Create New Allocation
            foreach ($request->subjects as $subjectId) {
                $duplicate = TeacherAllocation::where('academic_year_id', $request->academic_year_id)
                    ->where('class_id', $request->class_id)
                    ->where('subject_id', $subjectId)
                    ->where('employee_id', '!=', $request->employee_id)
                    ->where('status', 1)
                    ->exists();

                if ($duplicate) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Subject is already allocated to another teacher.'
                    ], 422);
                }

                TeacherAllocation::create([
                    'academic_year_id' => $request->academic_year_id,
                    'class_id' => $request->class_id,
                    'subject_id' => $subjectId,
                    'employee_id' => $request->employee_id,
                    'status' => 1,
                    'created_by' => $oldAllocation->created_by,
                    'updated_by' => auth()->id(),
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Teacher Allocation updated successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Inactive List
     */
    public function inactive()
    {
        $allocations = TeacherAllocation::with([
            'academicYear',
            'class',
            'subject',
            'employee'
        ])
        ->where('status', 0)
        ->orderBy('academic_year_id')
        ->orderBy('class_id')
        ->orderBy('employee_id')
        ->get();

        $grouped = $allocations
            ->groupBy(function ($item) {
                return $item->academic_year_id . '_' .
                       $item->class_id . '_' .
                       $item->employee_id;
            })
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'id' => $first->id,
                    'academic_year_id' => $first->academic_year_id,
                    'class_id' => $first->class_id,
                    'employee_id' => $first->employee_id,
                    'status' => $first->status,
                    'academicYear' => $first->academicYear,
                    'class' => $first->class,
                    'employee' => $first->employee,
                    'subjects' => $items->pluck('subject'),
                    'created_at' => $first->created_at,
                    'updated_at' => $first->updated_at,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $grouped
        ]);
    }

    /**
     * Delete
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $allocation = TeacherAllocation::findOrFail($id);

            TeacherAllocation::where('academic_year_id', $allocation->academic_year_id)
                ->where('class_id', $allocation->class_id)
                ->where('employee_id', $allocation->employee_id)
                ->update([
                    'status' => 0,
                    'updated_by' => auth()->id(),
                    'updated_at' => now(),
                ]);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Teacher Allocation moved to inactive successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore
     */
    public function restore($id)
    {
        DB::beginTransaction();
        try {
            $allocation = TeacherAllocation::findOrFail($id);

            TeacherAllocation::where('academic_year_id', $allocation->academic_year_id)
                ->where('class_id', $allocation->class_id)
                ->where('employee_id', $allocation->employee_id)
                ->update([
                    'status' => 1,
                    'updated_by' => auth()->id(),
                    'updated_at' => now(),
                ]);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Teacher Allocation restored successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Subjects According to Selected Class
     */
    public function classSubjects($classId)
    {
        $subjects = ClassSubject::with('subject')
            ->where('class_id', $classId)
            ->where('status', 1)
            ->orderBy('id')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->subject->id,
                    'subject_name' => $item->subject->subject_name,
                    'subject_code' => $item->subject->subject_code,
                ];
            })
            ->unique('id')
            ->values();

        return response()->json([
            'success' => true,
            'data' => $subjects
        ]);
    }

    /**
     * Get Teachers
     */
    public function teachers()
    {
        $teachers = Employee::query()
            ->where('active', 1)
            ->select(
                'id',
                DB::raw("CONCAT(first_name,' ',last_name) as full_name")
            )
            ->orderBy('first_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $teachers
        ]);
    }
}
