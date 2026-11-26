<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\GalleryItem;
use App\Models\GalleryCategory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class GalleryController extends Controller
{
    public function index()
    {
        $galleryItems = GalleryItem::with('galleryCategory')->orderBy('order_number')->get();
        return view('admin.gallery.index', compact('galleryItems'));
    }

    public function create()
    {
        $categories = GalleryCategory::orderBy('order_number')->get();
        return view('admin.gallery.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'gallery_category_id' => 'required|exists:gallery_categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $file = $request->file('image');
        $filename = Str::random(20) . '.webp';
        $path = 'gallery/' . $filename;

        // Optimize and Resize using Intervention Image v3
        $image = Image::make($file);

        $image->resize(1200, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        Storage::disk('public')->put(
            $path,
            (string) $image->encode('webp', 80)
        );

        GalleryItem::create([
            'title' => $request->title,
            'gallery_category_id' => $request->gallery_category_id,
            'category' => GalleryCategory::find($request->gallery_category_id)->slug,
            'image_path' => 'storage/' . $path,
            'is_featured' => $request->has('is_featured'),
            'is_active' => $request->has('is_active'),
            'order_number' => (GalleryItem::max('order_number') ?? 0) + 1,
        ]);

        return redirect()->route('admin.gallery.index')->with('success', 'Image added to gallery.');
    }

    public function edit(GalleryItem $gallery)
    {
        $categories = GalleryCategory::orderBy('order_number')->get();
        return view('admin.gallery.edit', compact('gallery', 'categories'));
    }

    public function update(Request $request, GalleryItem $gallery)
{
    $request->validate([
        'title' => 'nullable|string|max:255',
        'gallery_category_id' => 'required|exists:gallery_categories,id',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
    ]);

    $data = [
        'title' => $request->title,
        'gallery_category_id' => $request->gallery_category_id,
        'category' => GalleryCategory::find($request->gallery_category_id)->slug,
        'is_featured' => $request->has('is_featured'),
        'is_active' => $request->has('is_active'),
    ];

    if ($request->hasFile('image')) {

        if (Str::contains($gallery->image_path, 'storage/gallery/')) {
            Storage::disk('public')->delete(
                str_replace('storage/', '', $gallery->image_path)
            );
        }

        $file = $request->file('image');
        $filename = Str::random(20) . '.webp';
        $path = 'gallery/' . $filename;

        $image = Image::make($file);

        $image->resize(1200, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        Storage::disk('public')->put(
            $path,
            (string) $image->encode('webp', 80)
        );

        $data['image_path'] = 'storage/' . $path;
    }

    $gallery->update($data);

    return redirect()
        ->route('admin.gallery.index')
        ->with('success', 'Gallery item updated.');
}

    public function destroy(GalleryItem $gallery)
{
    if (Str::contains($gallery->image_path, 'storage/gallery/')) {
        Storage::disk('public')->delete(
            str_replace('storage/', '', $gallery->image_path)
        );
    }

    $gallery->delete();

    return back()->with('success', 'Image removed from gallery.');
}
}
