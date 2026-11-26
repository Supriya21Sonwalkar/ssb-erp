<?php

namespace App\Http\Controllers\React;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;

class GalleryController extends Controller
{
    public function index()
    {
        $categories = GalleryCategory::whereHas('items', function ($query) {
                $query->where('is_active', 1);
            })
            ->orderBy('order_number')
            ->get([
                'id',
                'name',
                'slug'
            ]);

        $galleryItems = GalleryItem::with('galleryCategory')
            ->where('is_active', 1)
            ->orderBy('order_number')
            ->get()
            ->map(function ($item) {

                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'image' => asset($item->image_path),
                    'category' => $item->galleryCategory ? $item->galleryCategory->slug : null,
                    'category_name' => $item->galleryCategory ? $item->galleryCategory->name : null,
                    'featured' => $item->is_featured,
                ];
            });

        return response()->json([
            'categories' => $categories,
            'galleryItems' => $galleryItems,
        ]);
    }
}