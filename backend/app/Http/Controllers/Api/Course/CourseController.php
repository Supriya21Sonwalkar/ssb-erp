<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Index
    |--------------------------------------------------------------------------
    | Get all courses
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        try {

            $query = Course::query();


            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */

            if ($request->filled('search')) {

                $search = $request->search;

                $query->where(function ($q) use ($search) {

                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('subtitle', 'like', '%' . $search . '%')
                        ->orWhere('slug', 'like', '%' . $search . '%');

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Status Filter
            |--------------------------------------------------------------------------
            */

            if ($request->filled('is_active')) {

                $query->where(
                    'is_active',
                    $request->is_active
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Ordering
            |--------------------------------------------------------------------------
            */

            $courses = $query
                ->orderBy('order_number', 'asc')
                ->orderBy('title', 'asc')
                ->get();


            return response()->json([
                'status' => true,
                'message' => 'Courses fetched successfully.',
                'data' => $courses,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch courses.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    | Create new course
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([

                'title' => 'required|string|max:255',

                'subtitle' => 'nullable|string|max:255',

                'slug' => 'nullable|string|max:255|unique:courses,slug',

                'description' => 'nullable|string',

                'icon_class' => 'nullable|string|max:255',

                'order_number' => 'nullable|integer|min:0',

                'features' => 'nullable|array',

                'is_active' => 'nullable|boolean',

            ]);


            /*
            |--------------------------------------------------------------------------
            | Generate Slug
            |--------------------------------------------------------------------------
            */

            if (empty($validated['slug'])) {

                $slug = Str::slug(
                    $validated['title']
                );

                /*
                |--------------------------------------------------------------------------
                | Make sure generated slug is unique
                |--------------------------------------------------------------------------
                */

                $originalSlug = $slug;

                $counter = 1;

                while (
                    Course::where(
                        'slug',
                        $slug
                    )->exists()
                ) {

                    $slug =
                        $originalSlug .
                        '-' .
                        $counter;

                    $counter++;

                }

                $validated['slug'] = $slug;

            }
            

            /*
            |--------------------------------------------------------------------------
            | Defaults
            |--------------------------------------------------------------------------
            */

            if (!isset($validated['order_number'])) {

                $validated['order_number'] = 0;

            }

            if (!isset($validated['is_active'])) {

                $validated['is_active'] = true;

            }


            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            $course = Course::create(
                $validated
            );


            return response()->json([
                'status' => true,
                'message' => 'Course created successfully.',
                'data' => $course,
            ], 201);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to create course.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Show
    |--------------------------------------------------------------------------
    | Get single course
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        try {

            $course = Course::findOrFail($id);


            return response()->json([
                'status' => true,
                'message' => 'Course fetched successfully.',
                'data' => $course,
            ], 200);

        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Course not found.',
            ], 404);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch course.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        try {

            $course = Course::findOrFail($id);


            $validated = $request->validate([

                'title' => 'required|string|max:255',

                'subtitle' => 'nullable|string|max:255',

                'slug' => [
                    'nullable',
                    'string',
                    'max:255',
                    'unique:courses,slug,' . $id,
                ],

                'description' => 'nullable|string',

                'icon_class' => 'nullable|string|max:255',

                'order_number' => 'nullable|integer|min:0',

                'features' => 'nullable|array',

                'is_active' => 'nullable|boolean',

            ]);


            /*
            |--------------------------------------------------------------------------
            | Generate Slug if Empty
            |--------------------------------------------------------------------------
            */

            if (empty($validated['slug'])) {

                $slug = Str::slug(
                    $validated['title']
                );

                $originalSlug = $slug;

                $counter = 1;

                while (
                    Course::where('slug', $slug)
                        ->where('id', '!=', $id)
                        ->exists()
                ) {

                    $slug =
                        $originalSlug .
                        '-' .
                        $counter;

                    $counter++;

                }

                $validated['slug'] = $slug;

            }


            $course->update(
                $validated
            );


            return response()->json([
                'status' => true,
                'message' => 'Course updated successfully.',
                'data' => $course->fresh(),
            ], 200);

        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Course not found.',
            ], 404);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to update course.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        try {

            $course = Course::findOrFail($id);


            /*
            |--------------------------------------------------------------------------
            | Delete
            |--------------------------------------------------------------------------
            */

            $course->delete();


            return response()->json([
                'status' => true,
                'message' => 'Course deleted successfully.',
            ], 200);

        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Course not found.',
            ], 404);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to delete course.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Toggle Status
    |--------------------------------------------------------------------------
    */

    public function toggleStatus($id)
    {
        try {

            $course = Course::findOrFail($id);

            $course->is_active =
                !$course->is_active;

            $course->save();


            return response()->json([
                'status' => true,
                'message' =>
                    $course->is_active
                        ? 'Course activated successfully.'
                        : 'Course deactivated successfully.',
                'data' => $course,
            ], 200);

        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Course not found.',
            ], 404);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to update course status.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }
}