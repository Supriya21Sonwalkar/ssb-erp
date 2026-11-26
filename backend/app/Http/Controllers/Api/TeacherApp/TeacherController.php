<?php

namespace App\Http\Controllers\Api\TeacherApp;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeacherController extends Controller
{
    /**
     * Teacher Mobile Dashboard
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        $employee = $user->employee()
            ->with([
                'department',
                'designation',
            ])
            ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher record not found for this user.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Teacher dashboard loaded successfully.',

            'teacher' => [
                'user_id' => $user->id,

                'employee_id' => $employee->id,
                'employee_code' => $employee->employee_code,

                'first_name' => $employee->first_name,
                'middle_name' => $employee->middle_name,
                'last_name' => $employee->last_name,
                'full_name' => $employee->full_name,

                'name' => trim(
                    ($employee->first_name ?? '') . ' ' .
                    ($employee->middle_name ?? '') . ' ' .
                    ($employee->last_name ?? '')
                ),

                'email' => $employee->email,
                'mobile' => $employee->phone_number,

                'profile_photo' => $employee->profile_photo,

                'gender' => $employee->gender,
                'dob' => $employee->dob,

                'qualification' => $employee->qualification,
                'experience' => $employee->experience,
                'joining_date' => $employee->joining_date,

                'department' => $employee->department
                    ? $employee->department->name
                    : null,

                'designation' => $employee->designation
                    ? $employee->designation->name
                    : null,
            ],
        ]);
    }
}