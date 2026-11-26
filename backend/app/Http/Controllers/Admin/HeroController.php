<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\HomepageMedia;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function index()
    {
        $media = HomepageMedia::latest()->get();
        return view('admin.hero.index', compact('media'));
    }

    public function create()
    {
        return view('admin.hero.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'required|mimes:mp4,webm,ogg|max:51200', // 50MB
            'modal_video' => 'nullable|mimes:mp4,webm,ogg|max:51200',
            'thumbnail' => 'nullable|image|max:5120',
        ]);

        $videoPath = $request->file('video')->store('hero', 'public');
        $modalVideoPath = $request->hasFile('modal_video') ? $request->file('modal_video')->store('hero', 'public') : $videoPath;
        $thumbnailPath = $request->hasFile('thumbnail') ? $request->file('thumbnail')->store('hero', 'public') : null;

        if ($request->has('is_active')) {
            HomepageMedia::where('is_active', true)->update(['is_active' => false]);
        }

        HomepageMedia::create([
            'title' => $request->title,
            'video_path' => 'storage/' . $videoPath,
            'modal_video_path' => 'storage/' . $modalVideoPath,
            'thumbnail_path' => $thumbnailPath ? 'storage/' . $thumbnailPath : null,
            'is_active' => $request->has('is_active'),
        ]);

        return redirect()->route('admin.hero.index')->with('success', 'Hero media uploaded.');
    }

    public function edit(HomepageMedia $hero)
    {
        return view('admin.hero.edit', compact('hero'));
    }

    public function update(Request $request, HomepageMedia $hero)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'nullable|mimes:mp4,webm,ogg|max:51200',
            'modal_video' => 'nullable|mimes:mp4,webm,ogg|max:51200',
            'thumbnail' => 'nullable|image|max:5120',
        ]);

        $data = ['title' => $request->title];

        if ($request->hasFile('video')) {
            $data['video_path'] = 'storage/' . $request->file('video')->store('hero', 'public');
        }

        if ($request->hasFile('modal_video')) {
            $data['modal_video_path'] = 'storage/' . $request->file('modal_video')->store('hero', 'public');
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_path'] = 'storage/' . $request->file('thumbnail')->store('hero', 'public');
        }

        if ($request->has('is_active')) {
            HomepageMedia::where('id', '!=', $hero->id)->update(['is_active' => false]);
            $data['is_active'] = true;
        } else {
            $data['is_active'] = false;
        }

        $hero->update($data);

        return redirect()->route('admin.hero.index')->with('success', 'Hero media updated.');
    }

    public function destroy(HomepageMedia $hero)
    {
        // Don't delete active media if it's the only one
        if ($hero->is_active && HomepageMedia::count() > 1) {
            return back()->with('error', 'Please activate another video before deleting the current one.');
        }

        $hero->delete();
        return back()->with('success', 'Media deleted.');
    }
}
