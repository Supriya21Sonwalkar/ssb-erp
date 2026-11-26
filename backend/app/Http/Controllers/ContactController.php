<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enquiry;
use App\Http\Requests\EnquiryRequest;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_active', true)->orderBy('order_number')->get();
        return view('pages.contact', compact('courses'));
    }

    public function store(EnquiryRequest $request)
    {
        $data = $request->validated();
        
        if (!empty($data['course_id'])) {
            $course = Course::find($data['course_id']);
            $data['course_interest'] = $course->title;
        }

        $data['ip_address'] = $request->ip();
        $data['status'] = 'new';
        
        Enquiry::create($data);
        
        return back()->with('success', 'Thank you. Our admissions team will call you within 24 hours.');
    }
}
