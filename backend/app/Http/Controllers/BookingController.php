<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Course;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_active', true)->orderBy('order_number')->get();
        return view('pages.booking', compact('courses'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'     => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender'        => 'required|in:male,female,other',
            'father_name'   => 'nullable|string|max:255',
            'mother_name'   => 'nullable|string|max:255',
            'phone'         => 'required|string|max:20',
            'email'         => 'required|email|max:255',
            'address'       => 'nullable|string',
            'city'          => 'nullable|string|max:100',
            'state'         => 'nullable|string|max:100',
            'course_id'     => 'nullable|exists:courses,id',
            'message'       => 'nullable|string',
        ]);

        // Resolve course details
        if (!empty($data['course_id'])) {
            $course = Course::find($data['course_id']);
            $data['course_interest'] = $course->title;
            $data['fees_amount']     = $course->fees;
        }

        $data['ip_address']      = $request->ip();
        $data['status']          = 'new';
        $data['payment_status']  = 'pending';

        Booking::create($data);

        return back()->with('success', 'Your seat has been booked! Our team will contact you within 24 hours to confirm.');
    }
}
