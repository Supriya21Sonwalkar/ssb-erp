<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index()
    {
        $resources = Resource::where('is_active', true)->get();
        return view('pages.resources', compact('resources'));
    }

    public function download($id)
    {
        $resource = Resource::findOrFail($id);
        $resource->increment('download_count');
        // In a real app, check if file exists. For now returning a mock response or the file if it exists.
        if ($resource->file_path && file_exists(storage_path('app/public/resources/' . $resource->file_path))) {
            return response()->download(storage_path('app/public/resources/' . $resource->file_path));
        }
        return back()->with('error', 'File not found.');
    }
}
