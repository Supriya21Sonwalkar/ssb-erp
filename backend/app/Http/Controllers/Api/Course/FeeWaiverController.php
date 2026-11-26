<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\StudentFeeWaiver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeeWaiverController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Index - List All Waivers
    |--------------------------------------------------------------------------
    |
    | Returns all fee waiver records with optional filters.
    |
    | Supports:
    | - Academic Year Filter
    | - Class Filter
    | - Status Filter
    |
    */


    public function index(Request $request)
    {
        try {

            $academicYearId = $request->get('academic_year_id');
            $classId = $request->get('class_id');
            $status = $request->get('status');


            $query = StudentFeeWaiver::with([
                'student',
                'course',
                'feeStructure.feeComponent',
                'approvedBy',
                'createdBy',
            ]);


            if (!empty($academicYearId)) {

                $query->whereHas('student', function ($q) use ($academicYearId) {

                    $q->where('academic_year_id', $academicYearId);

                });

            }


            if (!empty($classId)) {

                $query->whereHas('student', function ($q) use ($classId) {

                    $q->where('class_id', $classId);

                });

            }


            if ($status !== null && $status !== '') {

                $query->where('status', $status === '1' || $status === true);

            }


            $waivers = $query
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc')
                ->get();


            return response()->json([

                'success' => true,

                'data' => $waivers,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to fetch fee waivers.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Search Students
    |--------------------------------------------------------------------------
    |
    | Used by Fee Waiver student search.
    |
    | Supports:
    | - Academic Year
    | - First Name
    | - Middle Name
    | - Last Name
    | - Full Name
    | - Admission Number
    |
    */


    public function students(Request $request)
    {
        try {

            $search = trim(
                $request->get('search', '')
            );

            $academicYearId =
                $request->get('academic_year_id');


            $query = Student::query();


            if (!empty($academicYearId)) {

                $query->where(
                    'academic_year_id',
                    $academicYearId
                );

            }


            if ($search !== '') {

                $query->where(function ($q) use ($search) {

                    $q->where(
                        'first_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'middle_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'last_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'full_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'admission_no',
                        'like',
                        '%' . $search . '%'
                    );

                });

            }


            $query->where(
                'status',
                1
            );


            $students = $query
                ->orderBy('first_name')
                ->limit(20)
                ->get([
                    'id',
                    'course_id',
                    'student_code',
                    'admission_no',
                    'roll_no',
                    'academic_year_id',
                    'class_id',
                    'section_id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'full_name',
                    'photo',
                ]);


            return response()->json([

                'success' => true,

                'data' => $students,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to search students.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Store - Create Fee Waiver
    |--------------------------------------------------------------------------
    */


    public function store(Request $request)
    {
        try {

            $validated =
                $request->validate([

                    'student_id' =>
                        'required|integer|exists:students,id',

                    'fee_structure_id' =>
                        'required|integer|exists:fee_structures,id',

                    'waiver_type' =>
                        'required|in:fixed,percentage',

                    'waiver_value' =>
                        'required|numeric|min:0',

                    'reason' =>
                        'required|string',

                    'status' =>
                        'nullable|boolean',

                    'remarks' =>
                        'nullable|string',

                ]);


            $student =
                Student::findOrFail(
                    $validated['student_id']
                );


            $courseId =
                $student->course_id;


            if (empty($courseId)) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Course is not assigned to this student.',

                ], 422);

            }


            $academicYearId =
                $student->academic_year_id;


            $feeStructure =
                FeeStructure::with([
                    'feeComponent',
                ])
                ->findOrFail(
                    $validated['fee_structure_id']
                );


            if (
                (int) $feeStructure->course_id
                !==
                (int) $courseId
            ) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Selected fee structure does not belong to this student course.',

                ], 422);

            }


            if (
                (int) $feeStructure->academic_year_id
                !==
                (int) $academicYearId
            ) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Selected fee structure does not belong to this student academic year.',

                ], 422);

            }


            $totalFee =
                (float)
                $feeStructure->total_amount;


            $waiverValue =
                (float)
                $validated['waiver_value'];


            $waiverAmount = 0;


            if (
                $validated['waiver_type'] === 'percentage'
            ) {

                if ($waiverValue > 100) {

                    return response()->json([

                        'success' => false,

                        'message' =>
                            'Percentage value cannot exceed 100%.',

                    ], 422);

                }

                $waiverAmount =
                    ($totalFee * $waiverValue) / 100;

            }
            else {

                if ($waiverValue > $totalFee) {

                    return response()->json([

                        'success' => false,

                        'message' =>
                            'Fixed waiver amount cannot exceed total fee amount.',

                    ], 422);

                }

                $waiverAmount = $waiverValue;

            }


            $waiver = StudentFeeWaiver::create([

                'student_id' =>
                    $student->id,

                'course_id' =>
                    $courseId,

                'fee_structure_id' =>
                    $feeStructure->id,

                'waiver_type' =>
                    $validated['waiver_type'],

                'waiver_value' =>
                    $waiverValue,

                'waiver_amount' =>
                    $waiverAmount,

                'reason' =>
                    $validated['reason'],

                'status' =>
                    $validated['status'] ?? true,

                'approved_by' =>
                    Auth::id(),

                'approved_at' =>
                    now(),

                'remarks' =>
                    $validated['remarks'] ?? null,

                'created_by' =>
                    Auth::id(),

            ]);


            return response()->json([

                'success' => true,

                'message' =>
                    'Fee waiver created successfully.',

                'data' =>
                    $waiver->load([
                        'student',
                        'course',
                        'feeStructure',
                    ]),

            ], 201);

        }
        catch (
            \Illuminate\Validation\ValidationException $e
        ) {

            throw $e;

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to create fee waiver.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Show - Single Waiver
    |--------------------------------------------------------------------------
    */


    public function show($id)
    {
        try {

            $waiver =
                StudentFeeWaiver::with([
                    'student',
                    'course',
                    'feeStructure.feeComponent',
                    'approvedBy',
                    'createdBy',
                ])
                ->findOrFail($id);


            return response()->json([

                'success' => true,

                'data' =>
                    $waiver,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Fee waiver not found.',

                'error' =>
                    $e->getMessage(),

            ], 404);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Update - Edit Fee Waiver
    |--------------------------------------------------------------------------
    */


    public function update(Request $request, $id)
    {
        try {

            $waiver =
                StudentFeeWaiver::findOrFail($id);


            $validated =
                $request->validate([

                    'waiver_type' =>
                        'nullable|in:fixed,percentage',

                    'waiver_value' =>
                        'nullable|numeric|min:0',

                    'reason' =>
                        'nullable|string',

                    'status' =>
                        'nullable|boolean',

                    'remarks' =>
                        'nullable|string',

                ]);


            $feeStructure =
                FeeStructure::findOrFail(
                    $waiver->fee_structure_id
                );


            $totalFee =
                (float)
                $feeStructure->total_amount;


            if (
                isset($validated['waiver_type']) ||
                isset($validated['waiver_value'])
            ) {

                $waiverType =
                    $validated['waiver_type'] ??
                    $waiver->waiver_type;

                $waiverValue =
                    isset($validated['waiver_value'])
                    ? (float) $validated['waiver_value']
                    : (float) $waiver->waiver_value;


                $waiverAmount = 0;


                if ($waiverType === 'percentage') {

                    if ($waiverValue > 100) {

                        return response()->json([

                            'success' => false,

                            'message' =>
                                'Percentage value cannot exceed 100%.',

                        ], 422);

                    }

                    $waiverAmount =
                        ($totalFee * $waiverValue) / 100;

                }
                else {

                    if ($waiverValue > $totalFee) {

                        return response()->json([

                            'success' => false,

                            'message' =>
                                'Fixed waiver amount cannot exceed total fee amount.',

                        ], 422);

                    }

                    $waiverAmount = $waiverValue;

                }


                $waiver->waiver_type = $waiverType;
                $waiver->waiver_value = $waiverValue;
                $waiver->waiver_amount = $waiverAmount;

            }


            if (isset($validated['reason'])) {

                $waiver->reason = $validated['reason'];

            }


            if (isset($validated['status'])) {

                $waiver->status = $validated['status'];

                if ($validated['status'] && !$waiver->approved_by) {

                    $waiver->approved_by = Auth::id();
                    $waiver->approved_at = now();

                }

            }


            if (isset($validated['remarks'])) {

                $waiver->remarks = $validated['remarks'];

            }


            $waiver->updated_by = Auth::id();
            $waiver->save();


            return response()->json([

                'success' => true,

                'message' =>
                    'Fee waiver updated successfully.',

                'data' =>
                    $waiver->load([
                        'student',
                        'course',
                        'feeStructure',
                    ]),

            ], 200);

        }
        catch (
            \Illuminate\Validation\ValidationException $e
        ) {

            throw $e;

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to update fee waiver.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Destroy - Delete Fee Waiver
    |--------------------------------------------------------------------------
    */


    public function destroy($id)
    {
        try {

            $waiver =
                StudentFeeWaiver::findOrFail($id);


            $waiver->delete();


            return response()->json([

                'success' => true,

                'message' =>
                    'Fee waiver deleted successfully.',

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to delete fee waiver.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }
}
