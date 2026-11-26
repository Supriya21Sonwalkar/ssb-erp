<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $galleryItems = \App\Models\GalleryItem::where('is_active', true)->orderBy('order_number')->get();
        $categories = \App\Models\GalleryCategory::orderBy('order_number')->get();
        return view('pages.gallery', compact('galleryItems', 'categories'));
    }
}
