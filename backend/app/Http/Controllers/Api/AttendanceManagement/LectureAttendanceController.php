<?php

namespace App\Http\Controllers\Api\AttendanceManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\LectureAttendanceSession;
use App\Models\LectureAttendance;

class LectureAttendanceController extends Controller
{
    /**
     * Normalize attendance status for Lecture Attendance (only P/A allowed).
     */
    private function normalizeLectureStatus($status)
    {
        $map = [
            'Present'   => 'P',
            'present'   => 'P',
            'P'         => 'P',
            'p'         => 'P',
            'Absent'    => 'A',
            'absent'    => 'A',
            'A'         => 'A',
            'a'         => 'A',
        ];

        return is_string($status) && isset($map[trim($status)])
            ? $map[trim($status)]
            : 'P';
    }


    /*
    |--------------------------------------------------------------------------
    | Index
    |--------------------------------------------------------------------------
    | Load basic data required for Lecture Attendance screen.
    |--------------------------------------------------------------------------
    */

public function index(Request $request)
{
    try {

        $query = DB::table('lecture_attendance_sessions as las')

            ->leftJoin(
                'academic_years as ay',
                'ay.id',
                '=',
                'las.academic_year_id'
            )

            ->leftJoin(
                'classes as c',
                'c.id',
                '=',
                'las.class_id'
            )

            ->leftJoin(
                'sections as s',
                's.id',
                '=',
                'las.section_id'
            )

            ->leftJoin(
                'subjects as sub',
                'sub.id',
                '=',
                'las.subject_id'
            )

            ->leftJoin(
                'lecture_attendances as la',
                'la.lecture_attendance_session_id',
                '=',
                'las.id'
            )

            ->select(
                'las.id',
                'las.academic_year_id',
                'las.class_id',
                'las.section_id',
                'las.subject_id',
                'las.lecture_date',
                'las.lecture_no',

                'ay.academic_year',

                'c.class_name',

                's.section_name',

                'sub.subject_name',

                DB::raw('COUNT(la.id) as total_students'),

                DB::raw("
                    SUM(
                        CASE
                            WHEN la.attendance_status = 'P'
                            THEN 1
                            ELSE 0
                        END
                    ) as present_count
                "),

                DB::raw("
                    SUM(
                        CASE
                            WHEN la.attendance_status = 'A'
                            THEN 1
                            ELSE 0
                        END
                    ) as absent_count
                ")
            )

            ->groupBy(
                'las.id',
                'las.academic_year_id',
                'las.class_id',
                'las.section_id',
                'las.subject_id',
                'las.lecture_date',
                'las.lecture_no',
                'ay.academic_year',
                'c.class_name',
                's.section_name',
                'sub.subject_name'
            )

            ->orderBy(
                'las.lecture_date',
                'desc'
            )
            
            ->orderBy(
                'las.lecture_no',
                'desc'
            );


        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        if ($request->academic_year_id) {

            $query->where(
                'las.academic_year_id',
                $request->academic_year_id
            );

        }

        if ($request->class_id) {

            $query->where(
                'las.class_id',
                $request->class_id
            );

        }

        if ($request->section_id) {

            $query->where(
                'las.section_id',
                $request->section_id
            );

        }

        if ($request->subject_id) {

            $query->where(
                'las.subject_id',
                $request->subject_id
            );

        }

        if ($request->lecture_date) {

            $query->whereDate(
                'las.lecture_date',
                $request->lecture_date
            );

        }


        $lectures = $query->get();


        return response()->json([
            'status' => true,
            'message' => 'Lecture attendance records fetched successfully.',
            'data' => $lectures,
        ]);

    } catch (\Exception $e) {

        \Log::error(
            'Lecture Attendance Index Error',
            [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]
        );

        return response()->json([
            'status' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}


    /*
    |--------------------------------------------------------------------------
    | Load Students
    |--------------------------------------------------------------------------
    | Load students according to:
    | Academic Year + Class + Section
    |--------------------------------------------------------------------------
    */

    public function loadStudents(Request $request)
    {
        $request->validate([

            'academic_year_id' => 'required|integer',

            'class_id' => 'required|integer',

            'section_id' => 'required|integer',

            'subject_id' => 'required|integer',

            'lecture_date' => 'required|date',

            'lecture_no' => 'required|integer',

        ]);

        try {

            /*
            |--------------------------------------------------------------------------
            | Students
            |--------------------------------------------------------------------------
            */

            $students = DB::table('students')

                ->where('academic_year_id', $request->academic_year_id)

                ->where('class_id', $request->class_id)

                ->where('section_id', $request->section_id)

                ->where('status', 1)

                ->orderBy('roll_no')

                ->get([

                    'id as student_id',

                    'roll_no',

                    'admission_no',

                    'full_name as student_name',

                ]);


            /*
            |--------------------------------------------------------------------------
            | No Students
            |--------------------------------------------------------------------------
            */

            if ($students->isEmpty()) {

                return response()->json([

                    'status' => false,

                    'message' => 'No students found for the selected Academic Year, Class and Section.',

                ], 404);
            }


            /*
            |--------------------------------------------------------------------------
            | Check Existing Lecture Session
            |--------------------------------------------------------------------------
            */

            $session = LectureAttendanceSession::where([

                'academic_year_id' => $request->academic_year_id,

                'class_id' => $request->class_id,

                'section_id' => $request->section_id,

                'lecture_date' => $request->lecture_date,

                'lecture_no' => $request->lecture_no,

                'subject_id' => $request->subject_id,

            ])->first();


            /*
            |--------------------------------------------------------------------------
            | Default Attendance
            |--------------------------------------------------------------------------
            */

            foreach ($students as $student) {

                $student->attendance_status = 'P';

                $student->remarks = null;

                /*
                |--------------------------------------------------------------------------
                | Existing Attendance
                |--------------------------------------------------------------------------
                */

                if ($session) {

                    $attendance = LectureAttendance::where(

                        'lecture_attendance_session_id',

                        $session->id

                    )

                    ->where(

                        'student_id',

                        $student->student_id

                    )

                    ->first();


                    if ($attendance) {

                        $student->attendance_status =
                            $this->normalizeLectureStatus($attendance->attendance_status);

                        $student->remarks =
                            $attendance->remarks;
                    }
                }
            }


            return response()->json([

                'status' => true,

                'message' => 'Students loaded successfully.',

                'attendance_exists' => $session ? true : false,

                'lecture_attendance_session_id' =>
                    $session ? $session->id : null,

                'attendance_locked' =>
                    $session ? (bool) $session->is_locked : false,

                'students' => $students,

            ]);

        } catch (\Exception $e) {

            \Log::error('Lecture Attendance Load Students Error', [

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
    | Store Attendance
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $request->validate([

            'academic_year_id' => 'required|integer',

            'class_id' => 'required|integer',

            'section_id' => 'required|integer',

            'subject_id' => 'required|integer',

            'lecture_date' => 'required|date',

            'lecture_no' => 'required|integer',

            'students' => 'required|array|min:1',

        ]);


        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Create / Get Lecture Session
            |--------------------------------------------------------------------------
            */

            $session = LectureAttendanceSession::firstOrCreate(

                [

                    'academic_year_id' =>
                        $request->academic_year_id,

                    'class_id' =>
                        $request->class_id,

                    'section_id' =>
                        $request->section_id,

                    'lecture_date' =>
                        $request->lecture_date,

                    'lecture_no' =>
                        $request->lecture_no,

                    'subject_id' =>
                        $request->subject_id,

                ],

                [

                    'teacher_id' =>
                        auth()->id(),

                    'marked_by' =>
                        auth()->id(),

                    'is_locked' =>
                        false,

                ]

            );


            /*
            |--------------------------------------------------------------------------
            | Check Locked
            |--------------------------------------------------------------------------
            */

            if ($session->is_locked) {

                DB::rollBack();

                return response()->json([

                    'status' => false,

                    'message' =>
                        'Lecture attendance is already locked.',

                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | Save Student Attendance
            |--------------------------------------------------------------------------
            */

            foreach ($request->students as $student) {

                $normalizedStatus = $this->normalizeLectureStatus($student['attendance_status']);

                LectureAttendance::updateOrCreate(

                    [

                        'lecture_attendance_session_id' =>
                            $session->id,

                        'student_id' =>
                            $student['student_id'],

                    ],

                    [

                        'attendance_status' =>
                            $normalizedStatus,

                        'remarks' =>
                            isset($student['remarks'])
                                ? $student['remarks']
                                : null,

                    ]

                );
            }


            DB::commit();


            return response()->json([

                'status' => true,

                'message' =>
                    'Lecture attendance saved successfully.',

                'lecture_attendance_session_id' =>
                    $session->id,

            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            \Log::error('Lecture Attendance Store Error', [

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