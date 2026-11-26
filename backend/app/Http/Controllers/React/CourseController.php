<?php

namespace App\Http\Controllers\React;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    /**
     * Get all active courses
     */
    public function index(): JsonResponse
    {
        try {

            $courses = Course::where('is_active', true)
                ->orderBy('order_number')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Courses fetched successfully.',
                'courses' => $courses,
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch courses.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }

    /**
     * Get single course by slug
     */
    public function show($slug): JsonResponse
    {
        try {

            $course = Course::where('slug', $slug)
                ->where('is_active', true)
                ->first();

            if (!$course) {

                return response()->json([
                    'status' => false,
                    'message' => 'Course not found.'
                ], 404);

            }

            return response()->json([
                'status' => true,
                'course' => $course
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch course.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }
}