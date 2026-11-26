<?php

namespace App\Http\Controllers\React;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnquiryRequest;
use App\Models\Course;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * Store a new enquiry.
     */
    public function store(EnquiryRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Store course title if course exists
        if (!empty($data['course_id'])) {
            $course = Course::find($data['course_id']);

            if ($course) {
                $data['course_interest'] = $course->title;
            }
        }

        $data['ip_address'] = $request->ip();
        $data['status'] = 'new';

        $enquiry = Enquiry::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your enquiry has been submitted successfully.',
            'data' => $enquiry,
        ], 201);
    }
}