<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_active', true)->orderBy('order_number')->get();
        $testimonials = Testimonial::where('is_featured', true)->orderBy('order_number')->get();
        $heroMedia = \App\Models\HomepageMedia::where('is_active', true)->first();
        
        return view('pages.home', compact('courses', 'testimonials', 'heroMedia'));
    }
}
