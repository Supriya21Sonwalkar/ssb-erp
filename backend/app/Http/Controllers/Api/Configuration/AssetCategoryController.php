<?php

namespace App\Http\Controllers\Api\Configuration;

use App\Http\Controllers\Controller;
use App\Models\AssetCategory;
use Illuminate\Http\Request;

class AssetCategoryController extends Controller
{
    public function index()
    {
        $categories = AssetCategory::where('status', 1)
            ->orderBy('category_name', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:150',
            'category_code' => 'required|string|max:50|unique:asset_categories,category_code',
            'description' => 'nullable|string',
        ], [
            'category_name.required' => 'Please enter category name.',
            'category_code.required' => 'Please enter category code.',
            'category_code.unique' => 'This category code already exists.',
        ]);

        $category = AssetCategory::create([
            'category_name' => $request->category_name,
            'category_code' => $request->category_code,
            'description' => $request->description,
            'status' => 1,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset category created successfully.',
            'data' => $category
        ], 201);
    }

    public function show($id)
    {
        $category = AssetCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Asset category not found.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $category
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = AssetCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Asset category not found.'
            ], 404);
        }

        $request->validate([
            'category_name' => 'required|string|max:150',
            'category_code' => 'required|string|max:50|unique:asset_categories,category_code,' . $category->id,
            'description' => 'nullable|string',
        ], [
            'category_name.required' => 'Please enter category name.',
            'category_code.required' => 'Please enter category code.',
            'category_code.unique' => 'This category code already exists.',
        ]);

        $category->update([
            'category_name' => $request->category_name,
            'category_code' => $request->category_code,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset category updated successfully.',
            'data' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = AssetCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Asset category not found.'
            ], 404);
        }

        $category->update([
            'status' => 0
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset category moved to inactive successfully.'
        ]);
    }

    public function inactive()
    {
        $categories = AssetCategory::where('status', 0)
            ->orderBy('category_name', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }

    public function restore($id)
    {
        $category = AssetCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Asset category not found.'
            ], 404);
        }

        $category->update([
            'status' => 1
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset category restored successfully.',
            'data' => $category
        ]);
    }


}