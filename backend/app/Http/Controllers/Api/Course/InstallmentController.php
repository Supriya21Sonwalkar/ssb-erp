<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        try {

            $query = Installment::with(['academicYear']);

            if ($request->filled('search')) {

                $search = $request->search;

                $query->where(function ($q) use ($search) {

                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhereHas('academicYear', function ($ayQuery) use ($search) {
                            $ayQuery->where('name', 'like', '%' . $search . '%');
                        });

                });
            }

            if ($request->filled('academic_year_id')) {

                $query->where(
                    'academic_year_id',
                    $request->academic_year_id
                );

            }

            if ($request->has('status') && $request->status !== '') {

                $query->where(
                    'status',
                    $request->status
                );

            }

            $installments = $query
                ->orderBy('start_date', 'asc')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Installments fetched successfully.',
                'data' => $installments,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch installments.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([

                'academic_year_id' => [
                    'required',
                    'integer',
                    'exists:academic_years,id',
                ],

                'name' => [
                    'required',
                    'string',
                    'max:150',
                    Rule::unique('installments', 'name')
                        ->where(function ($query) use ($request) {
                            return $query->where('academic_year_id', $request->academic_year_id);
                        }),
                ],

                'start_date' => [
                    'required',
                    'date',
                ],

                'end_date' => [
                    'required',
                    'date',
                    'after_or_equal:start_date',
                ],

                'status' => [
                    'nullable',
                    'boolean',
                ],

                'description' => [
                    'nullable',
                    'string',
                ],

            ]);

            DB::beginTransaction();

            $installment = new Installment();

            $installment->academic_year_id =
                $validated['academic_year_id'];

            $installment->name =
                $validated['name'];

            $installment->start_date =
                $validated['start_date'];

            $installment->end_date =
                $validated['end_date'];

            $installment->status =
                $validated['status'] ?? true;

            $installment->description =
                $validated['description'] ?? null;

            $installment->created_by =
                Auth::id();

            $installment->updated_by =
                Auth::id();

            $installment->save();

            DB::commit();

            $installment->load(['academicYear']);

            return response()->json([
                'status' => true,
                'message' => 'Installment created successfully.',
                'data' => $installment,
            ], 201);

        }
        catch (\Illuminate\Validation\ValidationException $e) {

            throw $e;

        }
        catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Unable to create installment.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }

    public function show($id)
    {
        try {

            $installment =
                Installment::with(['academicYear', 'feeStructures'])
                    ->findOrFail($id);

            return response()->json([
                'status' => true,
                'message' => 'Installment fetched successfully.',
                'data' => $installment,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Installment not found.',
                'error' => $e->getMessage(),
            ], 404);

        }
    }

    public function update(Request $request, $id)
    {
        try {

            $installment =
                Installment::findOrFail($id);

            $validated = $request->validate([

                'academic_year_id' => [
                    'required',
                    'integer',
                    'exists:academic_years,id',
                ],

                'name' => [
                    'required',
                    'string',
                    'max:150',
                    Rule::unique('installments', 'name')
                        ->where(function ($query) use ($request) {
                            return $query->where('academic_year_id', $request->academic_year_id);
                        })
                        ->ignore($installment->id),
                ],

                'start_date' => [
                    'required',
                    'date',
                ],

                'end_date' => [
                    'required',
                    'date',
                    'after_or_equal:start_date',
                ],

                'status' => [
                    'nullable',
                    'boolean',
                ],

                'description' => [
                    'nullable',
                    'string',
                ],

            ]);

            DB::beginTransaction();

            $installment->academic_year_id =
                $validated['academic_year_id'];

            $installment->name =
                $validated['name'];

            $installment->start_date =
                $validated['start_date'];

            $installment->end_date =
                $validated['end_date'];

            $installment->status =
                $validated['status'] ?? $installment->status;

            $installment->description =
                $validated['description'] ?? null;

            $installment->updated_by =
                Auth::id();

            $installment->save();

            DB::commit();

            $installment->load(['academicYear']);

            return response()->json([
                'status' => true,
                'message' => 'Installment updated successfully.',
                'data' => $installment,
            ], 200);

        }
        catch (\Illuminate\Validation\ValidationException $e) {

            throw $e;

        }
        catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Unable to update installment.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }

    public function toggleStatus($id)
    {
        try {

            $installment =
                Installment::findOrFail($id);

            $installment->status =
                !$installment->status;

            $installment->updated_by =
                Auth::id();

            $installment->save();

            return response()->json([
                'status' => true,
                'message' =>
                    $installment->status
                        ? 'Installment activated successfully.'
                        : 'Installment deactivated successfully.',
                'data' => $installment,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to update installment status.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }

    public function destroy($id)
    {
        try {

            $installment =
                Installment::findOrFail($id);

            $installment->delete();

            return response()->json([
                'status' => true,
                'message' => 'Installment deleted successfully.',
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to delete installment.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }
}
