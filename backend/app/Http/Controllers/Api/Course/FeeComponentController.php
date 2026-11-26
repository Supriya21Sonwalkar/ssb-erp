<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Models\FeeComponent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FeeComponentController extends Controller
{
    /**
     * Display all fee components.
     */
    public function index(Request $request)
    {
        try {

            $query = FeeComponent::query();

            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */

            if ($request->filled('search')) {

                $search = $request->search;

                $query->where(function ($q) use ($search) {

                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('code', 'like', '%' . $search . '%')
                        ->orWhere(
                            'component_type',
                            'like',
                            '%' . $search . '%'
                        );

                });
            }


            /*
            |--------------------------------------------------------------------------
            | Status Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('is_active')) {

                $query->where(
                    'is_active',
                    $request->is_active
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Component Type Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('component_type')) {

                $query->where(
                    'component_type',
                    $request->component_type
                );

            }


            $components = $query
                ->orderBy('name', 'asc')
                ->get();


            return response()->json([
                'status' => true,
                'message' => 'Fee components fetched successfully.',
                'data' => $components,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch fee components.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /**
     * Store a new fee component.
     */
    public function store(Request $request)
    {
        try {

            $validated = $request->validate([

                'name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'code' => [
                    'required',
                    'string',
                    'max:50',
                    'unique:fee_components,code',
                ],

                'component_type' => [
                    'required',
                    'string',
                    'max:30',
                ],

                'is_active' => [
                    'nullable',
                    'boolean',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                ],

            ]);


            DB::beginTransaction();


            $component = new FeeComponent();

            $component->name =
                $validated['name'];

            $component->code =
                strtoupper(
                    trim($validated['code'])
                );

            $component->component_type =
                strtolower(
                    trim($validated['component_type'])
                );

            $component->is_active =
                $validated['is_active'] ?? true;

            $component->remarks =
                $validated['remarks'] ?? null;

            $component->created_by =
                Auth::id();

            $component->updated_by =
                Auth::id();

            $component->save();


            DB::commit();


            return response()->json([
                'status' => true,
                'message' => 'Fee component created successfully.',
                'data' => $component,
            ], 201);

        }
        catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Unable to create fee component.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /**
     * Display a single fee component.
     */
    public function show($id)
    {
        try {

            $component =
                FeeComponent::findOrFail($id);


            return response()->json([
                'status' => true,
                'message' => 'Fee component fetched successfully.',
                'data' => $component,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Fee component not found.',
                'error' => $e->getMessage(),
            ], 404);

        }
    }


    /**
     * Update a fee component.
     */
    public function update(Request $request, $id)
    {
        try {

            $component =
                FeeComponent::findOrFail($id);


            $validated = $request->validate([

                'name' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'code' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique(
                        'fee_components',
                        'code'
                    )->ignore($component->id),
                ],

                'component_type' => [
                    'required',
                    'string',
                    'max:30',
                ],

                'is_active' => [
                    'nullable',
                    'boolean',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                ],

            ]);


            DB::beginTransaction();


            $component->name =
                $validated['name'];

            $component->code =
                strtoupper(
                    trim($validated['code'])
                );

            $component->component_type =
                strtolower(
                    trim($validated['component_type'])
                );

            $component->is_active =
                $validated['is_active'] ?? $component->is_active;

            $component->remarks =
                $validated['remarks'] ?? null;

            $component->updated_by =
                Auth::id();

            $component->save();


            DB::commit();


            return response()->json([
                'status' => true,
                'message' => 'Fee component updated successfully.',
                'data' => $component,
            ], 200);

        }
        catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Unable to update fee component.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /**
     * Toggle active / inactive status.
     */
    public function toggleStatus($id)
    {
        try {

            $component =
                FeeComponent::findOrFail($id);


            $component->is_active =
                !$component->is_active;

            $component->updated_by =
                Auth::id();

            $component->save();


            return response()->json([
                'status' => true,
                'message' =>
                    $component->is_active
                        ? 'Fee component activated successfully.'
                        : 'Fee component deactivated successfully.',
                'data' => $component,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to update fee component status.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /**
     * Delete a fee component.
     */
    public function destroy($id)
    {
        try {

            $component =
                FeeComponent::findOrFail($id);


            $component->delete();


            return response()->json([
                'status' => true,
                'message' => 'Fee component deleted successfully.',
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to delete fee component.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }
}