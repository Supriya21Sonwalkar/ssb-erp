<?php

namespace App\Http\Controllers\React;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Testimonial;
use App\Models\HomepageMedia;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    /**
     * React Home Page API
     */
    public function index(): JsonResponse
    {
        $heroMedia = HomepageMedia::where('is_active', true)
                        ->first();

        $courses = Course::where('is_active', true)
                        ->orderBy('order_number')
                        ->get();

        $testimonials = Testimonial::where('is_featured', true)
                        ->orderBy('order_number')
                        ->get();

        return response()->json([
            'status' => true,

            'message' => 'Home page data fetched successfully.',

            'data' => [

                'heroMedia' => $heroMedia,

                'courses' => $courses,

                'testimonials' => $testimonials,

            ]

        ]);
    }
}