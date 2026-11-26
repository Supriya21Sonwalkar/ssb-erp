<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::latest();

        if ($request->filled('search')) {
            $query->where('original_name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('type')) {
            $query->where('mime_type', 'like', $request->type . '/%');
        }

        $media = $query->paginate(24)->withQueryString();
        return view('admin.media.index', compact('media'));
    }

    public function store(Request $request)
{
    $request->validate([
        'file' => 'required|file|max:51200', // 50MB
    ]);

    $file = $request->file('file');
    $originalName = $file->getClientOriginalName();
    $mimeType = $file->getClientMimeType();
    $size = $file->getSize();

    // Prevent duplicates
    $exists = Media::where('original_name', $originalName)
        ->where('size', $size)
        ->first();

    if ($exists) {
        return back()->with('info', 'File already exists in library.');
    }

    if (Str::startsWith($mimeType, 'image/')) {

        $filename = Str::random(20) . '.webp';
        $path = 'media/' . $filename;

        $image = Image::make($file);

        $image->resize(1920, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        $webpData = (string) $image->encode('webp', 80);

        Storage::disk('public')->put($path, $webpData);

        $mimeType = 'image/webp';
        $size = strlen($webpData);

    } else {

        $path = $file->store('media', 'public');

    }

    Media::create([
        'original_name' => $originalName,
        'filename'      => basename($path),
        'mime_type'     => $mimeType,
        'size'          => $size,
        'path'          => $path,
    ]);

    return back()->with('success', 'File uploaded successfully.');
}

    public function destroy(Media $media)
{
    Storage::disk('public')->delete($media->path);

    $media->delete();

    return back()->with('success', 'Media deleted.');
}
}
