<?php

namespace App\Http\Controllers\Api\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AssetController extends Controller
{
    /**
     * Get active assets
     */
    public function index()
    {
        $assets = Asset::with([
                'category:id,category_name,category_code',
                'subcategory:id,category_id,subcategory_name,subcategory_code',
            ])
            ->where('status', 1)
            ->orderBy('asset_name', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $assets,
        ]);
    }

    /**
     * Store new asset
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:asset_categories,id',
            ],

            'subcategory_id' => [
                'required',
                'integer',
                'exists:asset_subcategories,id',
            ],

            'asset_name' => [
                'required',
                'string',
                'max:200',
            ],

            'asset_code' => [
                'required',
                'string',
                'max:100',
                'unique:assets,asset_code',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        /*
         * Make sure selected subcategory actually
         * belongs to selected category.
         */
        $subcategoryExists = \App\Models\AssetSubcategory::where('id', $request->subcategory_id)
            ->where('category_id', $request->category_id)
            ->where('status', 1)
            ->exists();

        if (!$subcategoryExists) {
            return response()->json([
                'status' => false,
                'message' => 'Selected subcategory does not belong to the selected category.',
            ], 422);
        }

        $validated['status'] = 1;

        $asset = Asset::create($validated);

        $asset->load([
            'category:id,category_name,category_code',
            'subcategory:id,category_id,subcategory_name,subcategory_code',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset created successfully.',
            'data' => $asset,
        ], 201);
    }

    /**
     * Show asset
     */
    public function show($id)
    {
        $asset = Asset::with([
            'category:id,category_name,category_code',
            'subcategory:id,category_id,subcategory_name,subcategory_code',
        ])->find($id);

        if (!$asset) {
            return response()->json([
                'status' => false,
                'message' => 'Asset not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $asset,
        ]);
    }

    /**
     * Update asset
     */
    public function update(Request $request, $id)
    {
        $asset = Asset::find($id);

        if (!$asset) {
            return response()->json([
                'status' => false,
                'message' => 'Asset not found.',
            ], 404);
        }

        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:asset_categories,id',
            ],

            'subcategory_id' => [
                'required',
                'integer',
                'exists:asset_subcategories,id',
            ],

            'asset_name' => [
                'required',
                'string',
                'max:200',
            ],

            'asset_code' => [
                'required',
                'string',
                'max:100',
                Rule::unique('assets', 'asset_code')->ignore($asset->id),
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $subcategoryExists = \App\Models\AssetSubcategory::where('id', $request->subcategory_id)
            ->where('category_id', $request->category_id)
            ->where('status', 1)
            ->exists();

        if (!$subcategoryExists) {
            return response()->json([
                'status' => false,
                'message' => 'Selected subcategory does not belong to the selected category.',
            ], 422);
        }

        $asset->update($validated);

        $asset->load([
            'category:id,category_name,category_code',
            'subcategory:id,category_id,subcategory_name,subcategory_code',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset updated successfully.',
            'data' => $asset,
        ]);
    }

    /**
     * Make asset inactive
     */
    public function destroy($id)
    {
        $asset = Asset::find($id);

        if (!$asset) {
            return response()->json([
                'status' => false,
                'message' => 'Asset not found.',
            ], 404);
        }

        $asset->status = 0;
        $asset->save();

        return response()->json([
            'status' => true,
            'message' => 'Asset moved to inactive successfully.',
        ]);
    }

    /**
     * Get inactive assets
     */
    public function inactive()
    {
        $assets = Asset::with([
                'category:id,category_name,category_code',
                'subcategory:id,category_id,subcategory_name,subcategory_code',
            ])
            ->where('status', 0)
            ->orderBy('asset_name', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $assets,
        ]);
    }

    /**
     * Restore inactive asset
     */
    public function restore($id)
    {
        $asset = Asset::find($id);

        if (!$asset) {
            return response()->json([
                'status' => false,
                'message' => 'Asset not found.',
            ], 404);
        }

        $asset->status = 1;
        $asset->save();

        $asset->load([
            'category:id,category_name,category_code',
            'subcategory:id,category_id,subcategory_name,subcategory_code',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Asset restored successfully.',
            'data' => $asset,
        ]);
    }
}