<?php

namespace App\Http\Controllers\Api\HomeworkAssignment;

use App\Http\Controllers\Controller;
use App\Models\HomeworkAssignment;
use App\Models\HomeworkAssignmentAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Student;

class HomeworkAssignmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Index
    |--------------------------------------------------------------------------
    | Get homework posted by the logged-in teacher.
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        try {

            $query = HomeworkAssignment::with([
                'attachments',
                'class',
                'section',
                'subject'
            ]);

            /*
            |--------------------------------------------------------------------------
            | Teacher restriction
            |--------------------------------------------------------------------------
            */

            if (auth()->check()) {
                $query->where('created_by', auth()->id());
            }

            /*
            |--------------------------------------------------------------------------
            | Filters
            |--------------------------------------------------------------------------
            */

            if ($request->filled('academic_year_id')) {
                $query->where(
                    'academic_year_id',
                    $request->academic_year_id
                );
            }

            if ($request->filled('class_id')) {
                $query->where(
                    'class_id',
                    $request->class_id
                );
            }

            if ($request->filled('section_id')) {
                $query->where(
                    'section_id',
                    $request->section_id
                );
            }

            if ($request->filled('subject_id')) {
                $query->where(
                    'subject_id',
                    $request->subject_id
                );
            }

            if ($request->filled('status')) {
                $query->where(
                    'status',
                    $request->status
                );
            }

            if ($request->filled('from_date')) {
                $query->whereDate(
                    'assigned_date',
                    '>=',
                    $request->from_date
                );
            }

            if ($request->filled('to_date')) {
                $query->whereDate(
                    'assigned_date',
                    '<=',
                    $request->to_date
                );
            }

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
                        'LIKE',
                        '%' . $search . '%'
                    )
                    ->orWhere(
                        'description',
                        'LIKE',
                        '%' . $search . '%'
                    );

                });
            }

            $homework = $query
                ->orderBy('assigned_date', 'desc')
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Homework fetched successfully.',
                'data' => $homework,
            ]);

        } catch (\Exception $e) {

            \Log::error('Homework Index Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Student Homework
    |--------------------------------------------------------------------------
    | Get published homework assigned to the logged-in student.
    |--------------------------------------------------------------------------
    */

    public function studentHomework(Request $request)
    {
        try {

            $user = $request->user();

            /*
            |--------------------------------------------------------------------------
            | Find Student
            |--------------------------------------------------------------------------
            */

            $student = Student::where('user_id', $user->id)
                ->where('status', 1)
                ->first();

            if (!$student) {
                return response()->json([
                    'status' => false,
                    'message' => 'Student record not found for this user.',
                ], 404);
            }


            /*
            |--------------------------------------------------------------------------
            | Find Homework
            |--------------------------------------------------------------------------
            */

            $homework = HomeworkAssignment::with([
                'class',
                'section',
                'subject',
                'attachments',
            ])
            ->where('academic_year_id', $student->academic_year_id)
            ->where('class_id', $student->class_id)
            ->where('section_id', $student->section_id)
            ->where('status', 'Published')
            ->orderBy('assigned_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();


            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'status' => true,
                'message' => 'Student homework loaded successfully.',

                'student' => [
                    'id' => $student->id,
                    'student_code' => $student->student_code,
                    'name' => $student->full_name,
                    'academic_year_id' => $student->academic_year_id,
                    'class_id' => $student->class_id,
                    'section_id' => $student->section_id,
                ],

                'homework' => $homework,
            ]);

        } catch (\Exception $e) {

            \Log::error('Student Homework Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function studentHomeworkShow(Request $request, $id)
    {
        try {
            $user = $request->user();

            $student = Student::where('user_id', $user->id)
                ->where('status', 1)
                ->first();

            if (!$student) {
                return response()->json([
                    'status' => false,
                    'message' => 'Student record not found for this user.',
                ], 404);
            }

            $homework = HomeworkAssignment::with([
                'class',
                'section',
                'subject',
                'attachments',
            ])
            ->where('id', $id)
            ->where('academic_year_id', $student->academic_year_id)
            ->where('class_id', $student->class_id)
            ->where('section_id', $student->section_id)
            ->where('status', 'Published')
            ->first();

            if (!$homework) {
                return response()->json([
                    'status' => false,
                    'message' => 'Homework not found or not assigned to this student.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Homework details loaded successfully.',
                'homework' => $homework,
            ]);

        } catch (\Exception $e) {

            \Log::error('Student Homework Details Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Show
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        try {

            $homework = HomeworkAssignment::with([
                'attachments',
                'submissions',
                'class',
                'section',
                'subject'
            ])->find($id);

            if (!$homework) {
                return response()->json([
                    'status' => false,
                    'message' => 'Homework not found.',
                ], 404);
            }

            /*
            |--------------------------------------------------------------------------
            | Teacher restriction
            |--------------------------------------------------------------------------
            */

            if (
                auth()->check() &&
                $homework->created_by != auth()->id()
            ) {
                return response()->json([
                    'status' => false,
                    'message' => 'You are not authorized to view this homework.',
                ], 403);
            }

            return response()->json([
                'status' => true,
                'message' => 'Homework fetched successfully.',
                'data' => $homework,
            ]);

        } catch (\Exception $e) {

            \Log::error('Homework Show Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $request->validate([

            'academic_year_id' => 'required|integer',
            'class_id' => 'required|integer',
            'section_id' => 'required|integer',
            'subject_id' => 'required|integer',

            'title' => 'required|string|max:255',

            'homework_type' =>
                'required|string|max:50',

            'description' =>
                'required|string',

            'assigned_date' =>
                'required|date',

            'due_date' =>
                'required|date|after_or_equal:assigned_date',

            'total_marks' =>
                'nullable|numeric|min:0',

            'allow_late_submission' =>
                'required|boolean',

            'status' =>
                'required|in:Draft,Published',

            'attachments' =>
                'nullable|array',

            'attachments.*' =>
                'file|max:10240|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,zip',

        ]);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Create Homework
            |--------------------------------------------------------------------------
            */

            $homework = HomeworkAssignment::create([

                'academic_year_id' =>
                    $request->academic_year_id,

                'class_id' =>
                    $request->class_id,

                'section_id' =>
                    $request->section_id,

                'subject_id' =>
                    $request->subject_id,

                'title' =>
                    $request->title,

                'homework_type' =>
                    $request->homework_type,

                'description' =>
                    $request->description,

                'assigned_date' =>
                    $request->assigned_date,

                'due_date' =>
                    $request->due_date,

                'total_marks' =>
                    $request->total_marks,

                'allow_late_submission' =>
                    $request->allow_late_submission,

                'status' =>
                    $request->status,

                'created_by' =>
                    auth()->id(),

                'updated_by' =>
                    auth()->id(),

            ]);


            /*
            |--------------------------------------------------------------------------
            | Upload Attachments
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('attachments')) {

                foreach ($request->file('attachments') as $file) {

                    $path = $file->store(
                        'homework/attachments',
                        'public'
                    );

                    HomeworkAssignmentAttachment::create([

                        'homework_assignment_id' =>
                            $homework->id,

                        'file_name' =>
                            $file->getClientOriginalName(),

                        'file_path' =>
                            $path,

                        'file_type' =>
                            $file->getClientMimeType(),

                        'file_size' =>
                            $file->getSize(),

                    ]);
                }
            }


            DB::commit();

            $homework->load('attachments');

            return response()->json([
                'status' => true,
                'message' => 'Homework created successfully.',
                'data' => $homework,
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            \Log::error('Homework Store Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
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
        $request->validate([

            'academic_year_id' => 'required|integer',
            'class_id' => 'required|integer',
            'section_id' => 'required|integer',
            'subject_id' => 'required|integer',

            'title' =>
                'required|string|max:255',

            'homework_type' =>
                'required|string|max:50',

            'description' =>
                'required|string',

            'assigned_date' =>
                'required|date',

            'due_date' =>
                'required|date|after_or_equal:assigned_date',

            'total_marks' =>
                'nullable|numeric|min:0',

            'allow_late_submission' =>
                'required|boolean',

            'status' =>
                'required|in:Draft,Published,Closed',

            'attachments' =>
                'nullable|array',

            'attachments.*' =>
                'file|max:10240|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,zip',

        ]);

        DB::beginTransaction();

        try {

            $homework = HomeworkAssignment::find($id);

            if (!$homework) {

                DB::rollBack();

                return response()->json([
                    'status' => false,
                    'message' => 'Homework not found.',
                ], 404);
            }


            /*
            |--------------------------------------------------------------------------
            | Teacher restriction
            |--------------------------------------------------------------------------
            */

            if (
                auth()->check() &&
                $homework->created_by != auth()->id()
            ) {

                DB::rollBack();

                return response()->json([
                    'status' => false,
                    'message' =>
                        'You are not authorized to update this homework.',
                ], 403);
            }


            $homework->update([

                'academic_year_id' =>
                    $request->academic_year_id,

                'class_id' =>
                    $request->class_id,

                'section_id' =>
                    $request->section_id,

                'subject_id' =>
                    $request->subject_id,

                'title' =>
                    $request->title,

                'homework_type' =>
                    $request->homework_type,

                'description' =>
                    $request->description,

                'assigned_date' =>
                    $request->assigned_date,

                'due_date' =>
                    $request->due_date,

                'total_marks' =>
                    $request->total_marks,

                'allow_late_submission' =>
                    $request->allow_late_submission,

                'status' =>
                    $request->status,

                'updated_by' =>
                    auth()->id(),

            ]);


            /*
            |--------------------------------------------------------------------------
            | Add New Attachments
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('attachments')) {

                foreach ($request->file('attachments') as $file) {

                    $path = $file->store(
                        'homework/attachments',
                        'public'
                    );

                    HomeworkAssignmentAttachment::create([

                        'homework_assignment_id' =>
                            $homework->id,

                        'file_name' =>
                            $file->getClientOriginalName(),

                        'file_path' =>
                            $path,

                        'file_type' =>
                            $file->getClientMimeType(),

                        'file_size' =>
                            $file->getSize(),

                    ]);
                }
            }


            DB::commit();

            $homework->load('attachments');

            return response()->json([
                'status' => true,
                'message' => 'Homework updated successfully.',
                'data' => $homework,
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            \Log::error('Homework Update Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $homework = HomeworkAssignment::find($id);

            if (!$homework) {

                DB::rollBack();

                return response()->json([
                    'status' => false,
                    'message' => 'Homework not found.',
                ], 404);
            }


            if (
                auth()->check() &&
                $homework->created_by != auth()->id()
            ) {

                DB::rollBack();

                return response()->json([
                    'status' => false,
                    'message' =>
                        'You are not authorized to delete this homework.',
                ], 403);
            }


            /*
            |--------------------------------------------------------------------------
            | Delete Attachments
            |--------------------------------------------------------------------------
            */

            $attachments =
                $homework->attachments()->get();

            foreach ($attachments as $attachment) {

                if (
                    $attachment->file_path &&
                    Storage::disk('public')->exists(
                        $attachment->file_path
                    )
                ) {

                    Storage::disk('public')->delete(
                        $attachment->file_path
                    );
                }

                $attachment->delete();
            }


            /*
            |--------------------------------------------------------------------------
            | Delete Homework
            |--------------------------------------------------------------------------
            */

            $homework->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' =>
                    'Homework deleted successfully.',
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            \Log::error('Homework Delete Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Publish
    |--------------------------------------------------------------------------
    */

    public function publish($id)
    {
        return $this->changeStatus(
            $id,
            'Published',
            'Homework published successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */

    public function close($id)
    {
        return $this->changeStatus(
            $id,
            'Closed',
            'Homework closed successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Activate
    |--------------------------------------------------------------------------
    */

    public function activate($id)
    {
        return $this->changeStatus(
            $id,
            'Published',
            'Homework activated successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Change Status
    |--------------------------------------------------------------------------
    */

    private function changeStatus(
        $id,
        $status,
        $message
    ) {

        try {

            $homework =
                HomeworkAssignment::find($id);

            if (!$homework) {

                return response()->json([
                    'status' => false,
                    'message' => 'Homework not found.',
                ], 404);
            }


            if (
                auth()->check() &&
                $homework->created_by != auth()->id()
            ) {

                return response()->json([
                    'status' => false,
                    'message' =>
                        'You are not authorized to modify this homework.',
                ], 403);
            }


            $homework->update([

                'status' => $status,

                'updated_by' =>
                    auth()->id(),

            ]);


            return response()->json([
                'status' => true,
                'message' => $message,
                'data' => $homework,
            ]);

        } catch (\Exception $e) {

            \Log::error('Homework Status Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


}