<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    public function index()
    {
        Gate::authorize('manage-gallery', 'admin'); // Reusing content permission
        $courses = Course::orderBy('order_number')->get();
        return view('admin.courses.index', compact('courses'));
    }

    public function create()
    {
        Gate::authorize('manage-gallery', 'admin');
        return view('admin.courses.create');
    }

    public function store(Request $request)
    {
        Gate::authorize('manage-gallery', 'admin');
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['is_active'] = $request->has('is_active');
        $data['order_number'] = (Course::max('order_number') ?? 0) + 1;

        if ($request->hasFile('image')) {

            $file = $request->file('image');
            $filename = Str::random(20) . '.webp';
            $path = 'courses/' . $filename;

            $image = Image::make($file);

            $image->resize(800, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            Storage::disk('public')->put(
                $path,
                (string) $image->encode('webp', 80)
            );

            $data['image_path'] = 'storage/' . $path;
        }

        Course::create($data);

        return redirect()->route('admin.courses.index')->with('success', 'Course created.');
    }

    public function edit(Course $course)
    {
        Gate::authorize('manage-gallery', 'admin');
        return view('admin.courses.edit', compact('course'));
    }

    public function update(Request $request, Course $course)
    {
        Gate::authorize('manage-gallery', 'admin');
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|max:5120',
        ]);

        $data = $request->all();
        $data['is_active'] = $request->has('is_active');

        if ($request->hasFile('image')) {

            if (
                $course->image_path &&
                Storage::disk('public')->exists(
                    str_replace('storage/', '', $course->image_path)
                )
            ) {
                Storage::disk('public')->delete(
                    str_replace('storage/', '', $course->image_path)
                );
            }

            $file = $request->file('image');
            $filename = Str::random(20) . '.webp';
            $path = 'courses/' . $filename;

            $image = Image::make($file);

            $image->resize(800, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            Storage::disk('public')->put(
                $path,
                (string) $image->encode('webp', 80)
            );

            $data['image_path'] = 'storage/' . $path;
        }

        $course->update($data);

        return redirect()->route('admin.courses.index')->with('success', 'Course updated.');
    }

    public function destroy(Course $course)
    {
        Gate::authorize('manage-gallery', 'admin');
        if ($course->image_path && Storage::disk('public')->exists(str_replace('storage/', '', $course->image_path))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $course->image_path));
        }
        $course->delete();
        return back()->with('success', 'Course deleted.');
    }
}
