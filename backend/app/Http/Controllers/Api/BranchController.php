<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BranchController extends Controller
{
    /**
     * Active Branches
     */
    public function index()
    {
        $branches = Branch::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $branches
        ]);
    }

    /**
     * Inactive Branches
     */
    public function inactive()
    {
        $branches = Branch::onlyTrashed()
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $branches
        ]);
    }

    /**
     * Store Branch
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'branch_name' => 'required|max:255',
            'branch_code' => 'required|max:50|unique:branches,branch_code',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);

        }

        $branch = Branch::create([

            'branch_name' => $request->branch_name,
            'branch_code' => $request->branch_code,

        ]);

        return response()->json([

            'status' => true,
            'message' => 'Branch created successfully.',
            'branch' => $branch

        ], 201);
    }

    /**
     * Show Branch
     */
    public function show($id)
    {
        $branch = Branch::find($id);

        if (!$branch) {

            return response()->json([
                'status' => false,
                'message' => 'Branch not found.'
            ], 404);

        }

        return response()->json([
            'status' => true,
            'branch' => $branch
        ]);
    }

    /**
     * Update Branch
     */
    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);

        if (!$branch) {

            return response()->json([
                'status' => false,
                'message' => 'Branch not found.'
            ], 404);

        }

        $validator = Validator::make($request->all(), [

            'branch_name' => 'required|max:255',

            'branch_code' => 'required|max:50|unique:branches,branch_code,' . $branch->id,

        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);

        }

        $branch->update([

            'branch_name' => $request->branch_name,
            'branch_code' => $request->branch_code,

        ]);

        return response()->json([

            'status' => true,
            'message' => 'Branch updated successfully.',
            'branch' => $branch

        ]);
    }

    /**
     * Soft Delete
     */
    public function destroy($id)
    {
        $branch = Branch::find($id);

        if (!$branch) {

            return response()->json([
                'status' => false,
                'message' => 'Branch not found.'
            ], 404);

        }

        $branch->delete();

        return response()->json([

            'status' => true,
            'message' => 'Branch moved to inactive.'

        ]);
    }

    /**
     * Restore
     */
    public function restore($id)
    {
        $branch = Branch::onlyTrashed()->find($id);

        if (!$branch) {

            return response()->json([
                'status' => false,
                'message' => 'Branch not found.'
            ], 404);

        }

        $branch->restore();

        return response()->json([

            'status' => true,
            'message' => 'Branch restored successfully.'

        ]);
    }
}