<?php

namespace App\Http\Controllers\Api\HomeworkAssignment;

use App\Http\Controllers\Controller;
use App\Models\HomeworkAssignment;
use App\Models\HomeworkSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeworkSubmissionController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    | Show all homework/assignments with submission statistics.
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        try {

            $query = HomeworkAssignment::query();

            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */

            if ($request->filled('search')) {

                $search = $request->search;

                $query->where(function ($q) use ($search) {

                    $q->where(
                        'title',
                        'like',
                        '%' . $search . '%'
                    );

                });
            }


            /*
            |--------------------------------------------------------------------------
            | Get Homework
            |--------------------------------------------------------------------------
            */

            $homeworks = $query
                ->orderBy('created_at', 'desc')
                ->get();


            /*
            |--------------------------------------------------------------------------
            | Add Submission Statistics
            |--------------------------------------------------------------------------
            */

            $data = $homeworks->map(function ($homework) {

                $submissions = HomeworkSubmission::where(
                    'homework_assignment_id',
                    $homework->id
                );

                $totalAssigned = $this->getAssignedStudentCount(
                    $homework
                );

                $submitted = (clone $submissions)
                    ->where('status', 'Submitted')
                    ->count();

                $checked = (clone $submissions)
                    ->whereNotNull('checked_by')
                    ->count();

                $pending = max(
                    0,
                    $totalAssigned - $submitted
                );

                return [
                    'id' => $homework->id,

                    'title' => $homework->title ?? null,

                    'description' =>
                        $homework->description ?? null,

                    'class_id' =>
                        $homework->class_id ?? null,

                    'section_id' =>
                        $homework->section_id ?? null,

                    'subject_id' =>
                        $homework->subject_id ?? null,

                    'due_date' =>
                        $homework->due_date ?? null,

                    'total_students' =>
                        $totalAssigned,

                    'submitted_count' =>
                        $submitted,

                    'pending_count' =>
                        $pending,

                    'checked_count' =>
                        $checked,

                    'status' =>
                        $homework->status ?? null,

                    'created_at' =>
                        $homework->created_at,
                ];

            });


            return response()->json([
                'status' => true,
                'message' => 'Homework submissions fetched successfully.',
                'data' => $data,
            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch homework submissions.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | SHOW / TRACK
    |--------------------------------------------------------------------------
    | Get one homework with all assigned students and their
    | submission/checking status.
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        try {

            $homework = HomeworkAssignment::findOrFail($id);

            /*
            |--------------------------------------------------------------------------
            | Get Assigned Students
            |--------------------------------------------------------------------------
            */

            $students = $this->getAssignedStudents(
                $homework
            );


            /*
            |--------------------------------------------------------------------------
            | Get Submissions
            |--------------------------------------------------------------------------
            */

            $submissions = HomeworkSubmission::where(
                'homework_assignment_id',
                $id
            )
                ->get()
                ->keyBy('student_id');


            /*
            |--------------------------------------------------------------------------
            | Merge Students + Submission
            |--------------------------------------------------------------------------
            */

            $studentData = $students->map(function ($student) use ($submissions) {

                $submission = $submissions->get(
                    $student->id
                );

                return [
                    'student_id' =>
                        $student->id,

                    'student_name' => $student->full_name,

                    'roll_no' =>
                        $student->roll_no
                        ?? $student->student_roll_no
                        ?? null,

                    'submitted' =>
                        $submission
                            ? $submission->status === 'Submitted'
                            : false,

                    'checked' =>
                        $submission
                            ? !is_null($submission->checked_by)
                            : false,

                    'submission_id' =>
                        $submission
                            ? $submission->id
                            : null,

                    'submission_date' =>
                        $submission
                            ? $submission->submission_date
                            : null,

                    'attachment_path' =>
                        $submission
                            ? $submission->attachment_path
                            : null,

                    'marks' =>
                        $submission
                            ? $submission->marks
                            : null,

                    'teacher_remarks' =>
                        $submission
                            ? $submission->teacher_remarks
                            : null,
                ];

            });


            return response()->json([
                'status' => true,
                'message' => 'Homework tracking details fetched successfully.',

                'data' => [

                    'homework' => $homework,

                    'students' => $studentData,

                ],

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch homework tracking details.',
                'error' => $e->getMessage(),
            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE CHECKED STATUS
    |--------------------------------------------------------------------------
    */

public function updateStudentStatus(
    Request $request,
    $homeworkId,
    $studentId
) {
    try {

        $request->validate([
            'checked' => 'required|boolean',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Find existing submission
        |--------------------------------------------------------------------------
        */

        $submission = HomeworkSubmission::where(
            'homework_assignment_id',
            $homeworkId
        )
        ->where(
            'student_id',
            $studentId
        )
        ->first();


        /*
        |--------------------------------------------------------------------------
        | Create submission if it does not exist
        |--------------------------------------------------------------------------
        */

        if (!$submission) {

            $submission = new HomeworkSubmission();

            $submission->homework_assignment_id =
                $homeworkId;

            $submission->student_id =
                $studentId;

        }


        /*
        |--------------------------------------------------------------------------
        | Student has submitted homework
        |--------------------------------------------------------------------------
        */

        if ($request->checked) {

            $submission->status = 'Submitted';

            /*
            | Set submission date only the first time.
            */

            if (!$submission->submission_date) {

                $submission->submission_date = now();

            }


            /*
            | Teacher verification
            */

            $submission->checked_by =
                Auth::id();

            $submission->checked_at =
                now();

        }


        /*
        |--------------------------------------------------------------------------
        | Teacher unchecks submission
        |--------------------------------------------------------------------------
        */

        else {

            $submission->status =
                'Pending';

            $submission->checked_by =
                null;

            $submission->checked_at =
                null;

        }


        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        $submission->save();


        return response()->json([

            'status' => true,

            'message' => $request->checked
                ? 'Student marked as submitted successfully.'
                : 'Student marked as not submitted.',

            'data' => $submission,

        ], 200);

    }
    catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' =>
                'Unable to update student submission status.',

            'error' =>
                $e->getMessage(),

        ], 500);

    }
}


    /*
    |--------------------------------------------------------------------------
    | GET ASSIGNED STUDENT COUNT
    |--------------------------------------------------------------------------
    */

    private function getAssignedStudentCount($homework)
    {
        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        | This method depends on how assigned students are stored
        | in your HomeworkAssignment system.
        |--------------------------------------------------------------------------
        */

        return HomeworkSubmission::where(
            'homework_assignment_id',
            $homework->id
        )->count();
    }


    /*
    |--------------------------------------------------------------------------
    | GET ASSIGNED STUDENTS
    |--------------------------------------------------------------------------
    */

    private function getAssignedStudents($homework)
    {
        /*
        |--------------------------------------------------------------------------
        | TEMPORARY IMPLEMENTATION
        |--------------------------------------------------------------------------
        | We will replace this once we confirm how your homework
        | assignment stores class/section/student assignment.
        |--------------------------------------------------------------------------
        */

        return \App\Models\Student::query()
            ->where(
                'class_id',
                $homework->class_id
            )
            ->when(
                !empty($homework->section_id),
                function ($query) use ($homework) {

                    $query->where(
                        'section_id',
                        $homework->section_id
                    );

                }
            )
            ->get();
    }


    /*
    |--------------------------------------------------------------------------
    | EXISTING STUDENT SUBMISSION
    |--------------------------------------------------------------------------
    | Keep your existing submit() method here.
    |--------------------------------------------------------------------------
    */

}