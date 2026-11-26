<?php

namespace App\Http\Controllers\Api\Configuration;

use App\Http\Controllers\Controller;
use App\Models\AssetSubcategory;
use Illuminate\Http\Request;

class AssetSubcategoryController extends Controller
{
    /**
     * Display active subcategories.
     */
    public function index()
    {
        $subcategories = AssetSubcategory::with([
            'category:id,category_name,category_code'
        ])
        ->where('status', 1)
        ->orderBy('subcategory_name', 'asc')
        ->get();

        return response()->json([
            'status' => true,
            'data' => $subcategories
        ]);
    }

    /**
     * Store new subcategory.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:asset_categories,id',
            'subcategory_name' => 'required|string|max:150',
            'subcategory_code' => 'required|string|max:50',
            'description' => 'nullable|string',
        ], [
            'category_id.required' => 'Please select asset category.',
            'category_id.exists' => 'Selected asset category does not exist.',
            'subcategory_name.required' => 'Please enter subcategory name.',
            'subcategory_code.required' => 'Please enter subcategory code.',
        ]);

        // Check duplicate code inside same category
        $exists = AssetSubcategory::where('category_id', $request->category_id)
            ->where('subcategory_code', $request->subcategory_code)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'This subcategory code already exists for the selected category.'
            ], 422);
        }

        $subcategory = AssetSubcategory::create([
            'category_id' => $request->category_id,
            'subcategory_name' => $request->subcategory_name,
            'subcategory_code' => $request->subcategory_code,
            'description' => $request->description,
            'status' => 1,
        ]);

        $subcategory->load([
            'category:id,category_name,category_code'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset subcategory created successfully.',
            'data' => $subcategory
        ], 201);
    }

    /**
     * Display single subcategory.
     */
    public function show($id)
    {
        $subcategory = AssetSubcategory::with([
            'category:id,category_name,category_code'
        ])->find($id);

        if (!$subcategory) {
            return response()->json([
                'status' => false,
                'message' => 'Asset subcategory not found.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $subcategory
        ]);
    }

    /**
     * Update subcategory.
     */
    public function update(Request $request, $id)
    {
        $subcategory = AssetSubcategory::find($id);

        if (!$subcategory) {
            return response()->json([
                'status' => false,
                'message' => 'Asset subcategory not found.'
            ], 404);
        }

        $request->validate([
            'category_id' => 'required|exists:asset_categories,id',
            'subcategory_name' => 'required|string|max:150',
            'subcategory_code' => 'required|string|max:50',
            'description' => 'nullable|string',
        ], [
            'category_id.required' => 'Please select asset category.',
            'category_id.exists' => 'Selected asset category does not exist.',
            'subcategory_name.required' => 'Please enter subcategory name.',
            'subcategory_code.required' => 'Please enter subcategory code.',
        ]);

        // Check duplicate code within the selected category,
        // excluding the current subcategory.
        $exists = AssetSubcategory::where('category_id', $request->category_id)
            ->where('subcategory_code', $request->subcategory_code)
            ->where('id', '!=', $subcategory->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'This subcategory code already exists for the selected category.'
            ], 422);
        }

        $subcategory->update([
            'category_id' => $request->category_id,
            'subcategory_name' => $request->subcategory_name,
            'subcategory_code' => $request->subcategory_code,
            'description' => $request->description,
        ]);

        $subcategory->load([
            'category:id,category_name,category_code'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset subcategory updated successfully.',
            'data' => $subcategory
        ]);
    }

    /**
     * Move subcategory to inactive.
     */
    public function destroy($id)
    {
        $subcategory = AssetSubcategory::find($id);

        if (!$subcategory) {
            return response()->json([
                'status' => false,
                'message' => 'Asset subcategory not found.'
            ], 404);
        }

        $subcategory->update([
            'status' => 0
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset subcategory moved to inactive successfully.'
        ]);
    }

    /**
     * Display inactive subcategories.
     */
    public function inactive()
    {
        $subcategories = AssetSubcategory::with([
            'category:id,category_name,category_code'
        ])
        ->where('status', 0)
        ->orderBy('subcategory_name', 'asc')
        ->get();

        return response()->json([
            'status' => true,
            'data' => $subcategories
        ]);
    }

    /**
     * Restore inactive subcategory.
     */
    public function restore($id)
    {
        $subcategory = AssetSubcategory::find($id);

        if (!$subcategory) {
            return response()->json([
                'status' => false,
                'message' => 'Asset subcategory not found.'
            ], 404);
        }

        $subcategory->update([
            'status' => 1
        ]);

        $subcategory->load([
            'category:id,category_name,category_code'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset subcategory restored successfully.',
            'data' => $subcategory
        ]);
    }
}