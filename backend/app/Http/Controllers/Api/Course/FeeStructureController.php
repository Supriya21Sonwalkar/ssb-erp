<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class FeeStructureController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Get All Fee Structures
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        try {

            $query = FeeStructure::with([
                'feeComponent',
                'course',
                'academicYear',
                'installment',
            ]);


            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */

            if ($request->filled('search')) {

                $search = $request->search;

                $query->where(function ($q) use ($search) {

                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhereHas('course', function ($courseQuery) use ($search) {

                            $courseQuery
                                ->where('title', 'like', '%' . $search . '%');

                        })
                        ->orWhereHas('feeComponent', function ($componentQuery) use ($search) {

                            $componentQuery
                                ->where('name', 'like', '%' . $search . '%');

                        })
                        ->orWhereHas('installment', function ($installmentQuery) use ($search) {

                            $installmentQuery
                                ->where('name', 'like', '%' . $search . '%');

                        });

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Fee Component Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('fee_component_id')) {

                $query->where(
                    'fee_component_id',
                    $request->fee_component_id
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Course Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('course_id')) {

                $query->where(
                    'course_id',
                    $request->course_id
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Academic Year Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('academic_year_id')) {

                $query->where(
                    'academic_year_id',
                    $request->academic_year_id
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Installment Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('installment_id')) {

                $query->where(
                    'installment_id',
                    $request->installment_id
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Status Filter
            |--------------------------------------------------------------------------
            */

            if ($request->has('status') && $request->status !== '') {

                $query->where(
                    'status',
                    $request->status
                );

            }


            $feeStructures = $query
                ->orderBy('id', 'desc')
                ->get();


            return response()->json([

                'status' => true,

                'message' =>
                    'Fee structures fetched successfully.',

                'data' => $feeStructures,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'status' => false,

                'message' =>
                    'Unable to fetch fee structures.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Single Fee Structure
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        try {

            $feeStructure =
                FeeStructure::with([
                    'feeComponent',
                    'course',
                    'academicYear',
                    'installment',
                ])->findOrFail($id);


            return response()->json([

                'status' => true,

                'message' =>
                    'Fee structure fetched successfully.',

                'data' => $feeStructure,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'status' => false,

                'message' =>
                    'Unable to fetch fee structure.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Create Fee Structure
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        try {

            /*
            |--------------------------------------------------------------------------
            | Validation
            |--------------------------------------------------------------------------
            */

            $validated = $request->validate([

                'fee_component_id' => [
                    'required',
                    'integer',
                    'exists:fee_components,id',
                ],

                'course_id' => [
                    'nullable',
                    'integer',
                    'exists:courses,id',
                ],

                'academic_year_id' => [
                    'required',
                    'integer',
                    'exists:academic_years,id',
                ],

                'installment_id' => [
                    'nullable',
                    'integer',
                    'exists:installments,id',
                ],

                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'total_amount' => [
                    'required',
                    'numeric',
                    'min:0',
                ],

                'effective_from' => [
                    'nullable',
                    'date',
                ],

                'effective_to' => [
                    'nullable',
                    'date',
                    'after_or_equal:effective_from',
                ],

                'status' => [
                    'nullable',
                    'boolean',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                ],

            ]);


            /*
            |--------------------------------------------------------------------------
            | Prevent Duplicate Structure
            |--------------------------------------------------------------------------
            */

            $exists = FeeStructure::where(
                'fee_component_id',
                $validated['fee_component_id']
            )
                ->where(
                    'academic_year_id',
                    $validated['academic_year_id']
                )
                ->where(function ($query) use ($validated) {

                    if (
                        array_key_exists(
                            'course_id',
                            $validated
                        )
                    ) {

                        $query->where(
                            'course_id',
                            $validated['course_id']
                        );

                    } else {

                        $query->whereNull(
                            'course_id'
                        );

                    }

                })
                ->where(function ($query) use ($validated) {

                    if (
                        array_key_exists(
                            'installment_id',
                            $validated
                        ) &&
                        !is_null($validated['installment_id'])
                    ) {

                        $query->where(
                            'installment_id',
                            $validated['installment_id']
                        );

                    } else {

                        $query->whereNull(
                            'installment_id'
                        );

                    }

                })
                ->exists();


            if ($exists) {

                return response()->json([

                    'status' => false,

                    'message' =>
                        'A fee structure already exists for this component, course, academic year and installment.',

                ], 422);

            }


            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            $feeStructure = new FeeStructure();


            $feeStructure->fee_component_id =
                $validated['fee_component_id'];


            $feeStructure->course_id =
                $validated['course_id'] ?? null;


            $feeStructure->academic_year_id =
                $validated['academic_year_id'];


            $feeStructure->installment_id =
                $validated['installment_id'] ?? null;


            $feeStructure->name =
                $validated['name'];


            $feeStructure->total_amount =
                $validated['total_amount'];


            $feeStructure->effective_from =
                $validated['effective_from'] ?? null;


            $feeStructure->effective_to =
                $validated['effective_to'] ?? null;


            $feeStructure->status =
                $validated['status'] ?? true;


            $feeStructure->remarks =
                $validated['remarks'] ?? null;


            $feeStructure->created_by =
                Auth::id();


            $feeStructure->updated_by =
                Auth::id();


            $feeStructure->save();


            /*
            |--------------------------------------------------------------------------
            | Return Created Structure
            |--------------------------------------------------------------------------
            */

            $feeStructure->load([
                'feeComponent',
                'course',
                'academicYear',
                'installment',
            ]);


            return response()->json([

                'status' => true,

                'message' =>
                    'Fee structure created successfully.',

                'data' => $feeStructure,

            ], 201);

        }
        catch (\Illuminate\Validation\ValidationException $e) {

            throw $e;

        }
        catch (\Exception $e) {

            return response()->json([

                'status' => false,

                'message' =>
                    'Unable to create fee structure.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Update Fee Structure
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        try {

            $feeStructure =
                FeeStructure::findOrFail($id);


            $validated = $request->validate([

                'fee_component_id' => [
                    'required',
                    'integer',
                    'exists:fee_components,id',
                ],

                'course_id' => [
                    'nullable',
                    'integer',
                    'exists:courses,id',
                ],

                'academic_year_id' => [
                    'required',
                    'integer',
                    'exists:academic_years,id',
                ],

                'installment_id' => [
                    'nullable',
                    'integer',
                    'exists:installments,id',
                ],

                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'total_amount' => [
                    'required',
                    'numeric',
                    'min:0',
                ],

                'effective_from' => [
                    'nullable',
                    'date',
                ],

                'effective_to' => [
                    'nullable',
                    'date',
                    'after_or_equal:effective_from',
                ],

                'status' => [
                    'nullable',
                    'boolean',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                ],

            ]);


            /*
            |--------------------------------------------------------------------------
            | Duplicate Check
            |--------------------------------------------------------------------------
            */

            $exists = FeeStructure::where(
                'fee_component_id',
                $validated['fee_component_id']
            )
                ->where(
                    'academic_year_id',
                    $validated['academic_year_id']
                )
                ->where(function ($query) use ($validated) {

                    if (
                        array_key_exists(
                            'course_id',
                            $validated
                        )
                    ) {

                        $query->where(
                            'course_id',
                            $validated['course_id']
                        );

                    } else {

                        $query->whereNull(
                            'course_id'
                        );

                    }

                })
                ->where(function ($query) use ($validated) {

                    if (
                        array_key_exists(
                            'installment_id',
                            $validated
                        ) &&
                        !is_null($validated['installment_id'])
                    ) {

                        $query->where(
                            'installment_id',
                            $validated['installment_id']
                        );

                    } else {

                        $query->whereNull(
                            'installment_id'
                        );

                    }

                })
                ->where(
                    'id',
                    '!=',
                    $id
                )
                ->exists();


            if ($exists) {

                return response()->json([

                    'status' => false,

                    'message' =>
                        'A fee structure already exists for this component, course, academic year and installment.',

                ], 422);

            }


            /*
            |--------------------------------------------------------------------------
            | Update
            |--------------------------------------------------------------------------
            */

            $feeStructure->fee_component_id =
                $validated['fee_component_id'];


            $feeStructure->course_id =
                $validated['course_id'] ?? null;


            $feeStructure->academic_year_id =
                $validated['academic_year_id'];


            $feeStructure->installment_id =
                $validated['installment_id'] ?? null;


            $feeStructure->name =
                $validated['name'];


            $feeStructure->total_amount =
                $validated['total_amount'];


            $feeStructure->effective_from =
                $validated['effective_from'] ?? null;


            $feeStructure->effective_to =
                $validated['effective_to'] ?? null;


            $feeStructure->status =
                $validated['status'] ?? true;


            $feeStructure->remarks =
                $validated['remarks'] ?? null;


            $feeStructure->updated_by =
                Auth::id();


            $feeStructure->save();


            $feeStructure->load([
                'feeComponent',
                'course',
                'academicYear',
                'installment',
            ]);


            return response()->json([

                'status' => true,

                'message' =>
                    'Fee structure updated successfully.',

                'data' => $feeStructure,

            ], 200);

        }
        catch (\Illuminate\Validation\ValidationException $e) {

            throw $e;

        }
        catch (\Exception $e) {

            return response()->json([

                'status' => false,

                'message' =>
                    'Unable to update fee structure.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Fee Structure
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        try {

            $feeStructure =
                FeeStructure::findOrFail($id);


            $feeStructure->delete();


            return response()->json([

                'status' => true,

                'message' =>
                    'Fee structure deleted successfully.',

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'status' => false,

                'message' =>
                    'Unable to delete fee structure.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Toggle Status
    |--------------------------------------------------------------------------
    */

    public function toggleStatus($id)
    {
        try {

            $feeStructure =
                FeeStructure::findOrFail($id);


            $feeStructure->status =
                !$feeStructure->status;


            $feeStructure->updated_by =
                Auth::id();


            $feeStructure->save();


            return response()->json([

                'status' => true,

                'message' =>
                    $feeStructure->status
                        ? 'Fee structure activated successfully.'
                        : 'Fee structure deactivated successfully.',

                'data' => $feeStructure,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'status' => false,

                'message' =>
                    'Unable to update fee structure status.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }
}