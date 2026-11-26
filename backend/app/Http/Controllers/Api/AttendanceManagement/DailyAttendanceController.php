<?php

namespace App\Http\Controllers\Api\AttendanceManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\AttendanceSession;
use App\Models\StudentAttendance;
use App\Models\AttendanceLog;

use App\Models\Student;
use App\Models\Classes;
use App\Models\Section;
use App\Models\AcademicYear;

class DailyAttendanceController extends Controller
{
    /**
     * Normalize attendance status string to valid ENUM code.
     * Accepts both full names and codes; defaults to 'P'.
     */
    private function normalizeAttendanceStatus($status)
    {
        $map = [
            // Present
            'Present'   => 'P',
            'present'   => 'P',
            'P'         => 'P',
            'p'         => 'P',
            // Absent
            'Absent'    => 'A',
            'absent'    => 'A',
            'A'         => 'A',
            'a'         => 'A',
            // Late
            'Late'      => 'L',
            'late'      => 'L',
            'L'         => 'L',
            'l'         => 'L',
            // Half Day
            'Half Day'  => 'HD',
            'Half-Day'  => 'HD',
            'Halfday'   => 'HD',
            'half day'  => 'HD',
            'HD'        => 'HD',
            'hd'        => 'HD',
            // Leave / Holiday
            'Leave'     => 'H',
            'LEAVE'     => 'H',
            'leave'     => 'H',
            'LV'        => 'H',
            'lv'        => 'H',
            'H'         => 'H',
            'h'         => 'H',
            'Holiday'   => 'H',
            'holiday'   => 'H',
        ];

        $normalized = is_string($status) && isset($map[trim($status)])
            ? $map[trim($status)]
            : 'P';

        return $normalized;
    }



    /**
     * Load Attendance Screen
     */
public function index(Request $request)
{
    try {

        $academicYears = AcademicYear::orderBy('id', 'DESC')->get();

        $classes = Classes::orderBy('display_order')->get();

        $sections = Section::orderBy('section_name')->get();

        /*
        |--------------------------------------------------------------------------
        | Date Filter
        |--------------------------------------------------------------------------
        */

        $attendanceDate = $request->query('attendance_date', date('Y-m-d'));
        $classId = $request->query('class_id');
        $sectionId = $request->query('section_id');
        $academicYearId = $request->query('academic_year_id');

        $sessionsQuery = AttendanceSession::with([
            'academicYear',
            'class',
            'section',
            'attendances'
        ])
        ->where('status', 1)
        ->whereDate('attendance_date', $attendanceDate);

        if ($classId) {
            $sessionsQuery->where('class_id', $classId);
        }

        if ($sectionId) {
            $sessionsQuery->where('section_id', $sectionId);
        }

        if ($academicYearId) {
            $sessionsQuery->where('academic_year_id', $academicYearId);
        }

        $sessions = $sessionsQuery
            ->orderBy('attendance_date', 'DESC')
            ->orderBy('class_id')
            ->orderBy('section_id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Attach Attendance Summary
        |--------------------------------------------------------------------------
        */

        $sessionsWithSummary = $sessions->map(function ($session) {

            $attendances = $session->attendances;
            $total = $attendances->count();

            $present  = $attendances->whereIn('attendance_status', ['Present', 'P'])->count();
            $absent   = $attendances->whereIn('attendance_status', ['Absent', 'A'])->count();
            $late     = $attendances->whereIn('attendance_status', ['Late', 'L'])->count();
            $halfDay  = $attendances->whereIn('attendance_status', ['Half Day', 'Half-Day', 'HD'])->count();
            $onLeave  = $attendances->whereIn('attendance_status', ['Leave', 'LEAVE', 'LV'])->count();

            $attendancePercent = $total > 0 ? round(($present / $total) * 100, 2) : 0;

            return [
                'id'                 => $session->id,
                'academic_year_id'   => $session->academic_year_id,
                'academic_year'      => optional($session->academicYear)->name,
                'class_id'           => $session->class_id,
                'class_name'         => optional($session->class)->class_name,
                'section_id'         => $session->section_id,
                'section_name'       => optional($session->section)->section_name,
                'attendance_date'    => $session->attendance_date->format('Y-m-d'),
                'attendance_type'    => $session->attendance_type,
                'is_locked'          => (bool) $session->is_locked,
                'remarks'            => $session->remarks,
                'marked_by'          => $session->marked_by,
                'total_students'     => $total,
                'present'            => $present,
                'absent'             => $absent,
                'late'               => $late,
                'half_day'           => $halfDay,
                'on_leave'           => $onLeave,
                'attendance_percent' => $attendancePercent,
            ];

        });

        return response()->json([

            'status' => true,

            'message' => 'Attendance screen loaded successfully.',

            'data' => [

                'filters' => [
                    'attendance_date'  => $attendanceDate,
                    'class_id'         => $classId,
                    'section_id'       => $sectionId,
                    'academic_year_id' => $academicYearId,
                ],

                'academic_years' => $academicYears,

                'classes' => $classes,

                'sections' => $sections,

                'attendance_sessions' => $sessionsWithSummary,

            ]

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage(),

        ], 500);

    }
}
        /**
     * Load Students
     */
/**
 * Load Students For Daily Attendance
 */
public function loadStudents(Request $request)
{
    $request->validate([

        'academic_year_id' => 'required|integer|exists:academic_years,id',

        'class_id'         => 'nullable|integer|exists:classes,id',

        'section_id'       => 'nullable|integer|exists:sections,id',

        'attendance_date'  => 'required|date',

    ]);

    try {

        /*
        |--------------------------------------------------------------------------
        | Load Students with Progressive Filtering
        |--------------------------------------------------------------------------
        */

        $query = Student::with(['class', 'section'])
            ->where('academic_year_id', $request->academic_year_id)
            ->where('status', 1);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        $students = $query->orderBy('roll_no')->get();

        if ($students->isEmpty()) {

            $filterParts = [];
            if ($request->filled('academic_year_id')) {
                $filterParts[] = 'the selected Academic Year';
            }
            if ($request->filled('class_id')) {
                $filterParts[] = 'Class';
            }
            if ($request->filled('section_id')) {
                $filterParts[] = 'Section';
            }
            $filterText = implode(', ', $filterParts);

            return response()->json([

                'status'  => false,

                'message' => "No students found for {$filterText}."

            ], 404);

        }

        /*
        |--------------------------------------------------------------------------
        | Load Existing Attendance for all matching Sessions
        |--------------------------------------------------------------------------
        */

        $sessionQuery = AttendanceSession::where('status', 1)
            ->where('academic_year_id', $request->academic_year_id)
            ->whereDate('attendance_date', $request->attendance_date);

        if ($request->filled('class_id')) {
            $sessionQuery->where('class_id', $request->class_id);
        }

        if ($request->filled('section_id')) {
            $sessionQuery->where('section_id', $request->section_id);
        }

        $sessions = $sessionQuery->get();

        $attendanceRecords = collect();
        $lockedSessions = collect();

        if ($sessions->isNotEmpty()) {
            $attendanceRecords = StudentAttendance::whereIn(
                'attendance_session_id',
                $sessions->pluck('id')
            )->get()->keyBy('student_id');

            $lockedSessions = $sessions->where('is_locked', true);
        }

        /*
        |--------------------------------------------------------------------------
        | Prepare Response
        |--------------------------------------------------------------------------
        */

        $result = [];

        foreach ($students as $student) {

            $attendance = $attendanceRecords->get($student->id);

            $result[] = [

                'student_id' => $student->id,

                'student_code' => $student->student_code,

                'admission_no' => $student->admission_no,

                'roll_no' => $student->roll_no,

                'class_id' => $student->class_id,

                'class_name' => optional($student->class)->class_name,

                'section_id' => $student->section_id,

                'section_name' => optional($student->section)->section_name,

                'student_name' => trim(

                    $student->first_name . ' ' .

                    $student->middle_name . ' ' .

                    $student->last_name

                ),

                'attendance_status' => $attendance
                    ? $this->normalizeAttendanceStatus($attendance->attendance_status)
                    : 'P',

                'arrival_time' => optional($attendance)->arrival_time,

                'departure_time' => optional($attendance)->departure_time,

                'late_minutes' => optional($attendance)->late_minutes,

                'remarks' => optional($attendance)->remarks,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        $anyLocked = $lockedSessions->count() > 0;
        $totalSessions = $sessions->count();

        return response()->json([

            'status' => true,

            'message' => 'Students loaded successfully.',

            'attendance_exists' => $totalSessions > 0,

            'attendance_session_ids' => $sessions->pluck('id'),

            'attendance_locked' => $anyLocked,

            'attendance_locked_count' => $lockedSessions->count(),

            'attendance_total_sessions' => $totalSessions,

            'session_remarks' => null,

            'attendance_date' => $request->attendance_date,

            'academic_year_id' => $request->academic_year_id,

            'class_id' => $request->class_id,

            'section_id' => $request->section_id,

            'students' => $result,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage(),

        ], 500);

    }
}
    /**
 * Save Daily Attendance
 */
public function store(Request $request)
{
    $request->validate([

        'academic_year_id' => 'required|integer',

        'class_id' => 'nullable|integer',

        'section_id' => 'nullable|integer',

        'attendance_date' => 'required|date',

        'students' => 'required|array|min:1',

        'students.*.student_id' => 'required|integer',

        'students.*.attendance_status' => 'required|string',

        'students.*.section_id' => 'nullable|integer',

    ]);

    DB::beginTransaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Group Students by Section
        |--------------------------------------------------------------------------
        */

        $studentsBySection = collect($request->students)->groupBy(function ($student) {
            return $student['section_id'] ?? $request->section_id ?? 'no_section';
        });

        $savedSessionIds = [];

        foreach ($studentsBySection as $sectionId => $sectionStudents) {

            if ($sectionId === 'no_section') {
                continue;
            }

            $studentFirst = $sectionStudents->first();
            $sessionClassId = $studentFirst['class_id'] ?? $request->class_id;

            /*
            |--------------------------------------------------------------------------
            | Create / Get Attendance Session per Section
            |--------------------------------------------------------------------------
            */

            $session = AttendanceSession::firstOrCreate(

                [

                    'academic_year_id' => $request->academic_year_id,

                    'class_id' => $sessionClassId,

                    'section_id' => $sectionId,

                    'attendance_date' => $request->attendance_date,

                    'attendance_type' => 'Daily',

                ],

                [

                    'marked_by' => auth()->check() ? auth()->id() : null,

                    'is_locked' => false,

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

                    'message' => "Attendance for Section {$sectionId} is already locked."

                ], 422);

            }

            $savedSessionIds[] = $session->id;

            /*
            |--------------------------------------------------------------------------
            | Save Attendance for this Section's Students
            |--------------------------------------------------------------------------
            */

            foreach ($sectionStudents as $student) {

                $normalizedStatus = $this->normalizeAttendanceStatus($student['attendance_status']);

                $attendance = StudentAttendance::updateOrCreate(

                    [

                        'attendance_session_id' => $session->id,

                        'student_id' => $student['student_id'],

                    ],

                    [

                        'attendance_status' => $normalizedStatus,

                        'arrival_time' => $student['arrival_time'] ?? null,

                        'departure_time' => $student['departure_time'] ?? null,

                        'late_minutes' => $student['late_minutes'] ?? 0,

                        'remarks' => $student['remarks'] ?? null,

                    ]

                );

                /*
                |--------------------------------------------------------------------------
                | Attendance Log
                |--------------------------------------------------------------------------
                */

                AttendanceLog::create([

                    'attendance_id' => $attendance->id,

                    'old_status' => null,

                    'new_status' => $normalizedStatus,

                    'changed_by' => auth()->check() ? auth()->id() : null,

                    'reason' => 'Attendance Marked',

                ]);

            }

        }

        DB::commit();

        return response()->json([

            'status' => true,

            'message' => 'Attendance saved successfully.',

            'attendance_session_ids' => $savedSessionIds,

        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([

            'status' => false,

            'message' => $e->getMessage(),

        ], 500);

    }
}


/**
 * Show Attendance Session
 */
/**
 * Show Attendance Session
 */
public function show($id)
{
    try {

        /*
        |--------------------------------------------------------------------------
        | Load Attendance Session
        |--------------------------------------------------------------------------
        */

        $session = AttendanceSession::with([
            'academicYear',
            'class',
            'section',
            'attendances.student'
        ])
        ->where('status', 1)
        ->find($id);

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance session not found.'

            ], 404);

        }

        /*
        |--------------------------------------------------------------------------
        | Student Attendance
        |--------------------------------------------------------------------------
        */

        $students = [];

        foreach ($session->attendances as $attendance) {

            if (!$attendance->student) {
                continue;
            }

            $student = $attendance->student;

            $students[] = [

                'attendance_id' => $attendance->id,

                'student_id' => $student->id,

                'student_code' => $student->student_code ?? null,

                'admission_no' => $student->admission_no,

                'roll_no' => $student->roll_no,

                'student_name' => trim(

                    $student->first_name . ' ' .

                    $student->middle_name . ' ' .

                    $student->last_name

                ),

                'attendance_status' => $this->normalizeAttendanceStatus($attendance->attendance_status),

                'arrival_time' => $attendance->arrival_time,

                'departure_time' => $attendance->departure_time,

                'late_minutes' => $attendance->late_minutes,

                'remarks' => $attendance->remarks,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'message' => 'Attendance loaded successfully.',

            'attendance_exists' => true,

            'attendance_session_id' => $session->id,

            'attendance_locked' => (bool) $session->is_locked,

            'session' => [

                'id' => $session->id,

                'academic_year_id' => $session->academic_year_id,

                'academic_year' => optional($session->academicYear)->name,

                'class_id' => $session->class_id,

                'class_name' => optional($session->class)->class_name,

                'section_id' => $session->section_id,

                'section_name' => optional($session->section)->section_name,

                'attendance_date' => $session->attendance_date,

                'attendance_type' => $session->attendance_type,

                'remarks' => $session->remarks,

                'marked_by' => $session->marked_by,

                'verified_by' => $session->verified_by,

            ],

            'students' => $students,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage(),

        ], 500);

    }
}

/**
 * Update Daily Attendance
 */
public function update(Request $request, $id)
{
    $request->validate([

        'students' => 'required|array|min:1',

    ]);

    DB::beginTransaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Get Attendance Session
        |--------------------------------------------------------------------------
        */

        $session = AttendanceSession::find($id);

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance session not found.'

            ], 404);

        }

        /*
        |--------------------------------------------------------------------------
        | Check Locked
        |--------------------------------------------------------------------------
        */

        if ($session->is_locked) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance has been locked.'

            ], 422);

        }

        /*
        |--------------------------------------------------------------------------
        | Update Attendance
        |--------------------------------------------------------------------------
        */

        foreach ($request->students as $student) {

            $attendance = StudentAttendance::where(

                'attendance_session_id',
                $session->id

            )->where(

                'student_id',
                $student['student_id']

            )->first();

            if (!$attendance) {

                continue;

            }

            $oldStatus = $attendance->attendance_status;
            $normalizedStatus = $this->normalizeAttendanceStatus($student['attendance_status']);

            $attendance->attendance_status = $normalizedStatus;

            $attendance->arrival_time = $student['arrival_time'] ?? null;

            $attendance->departure_time = $student['departure_time'] ?? null;

            $attendance->late_minutes = $student['late_minutes'] ?? 0;

            $attendance->remarks = $student['remarks'] ?? null;

            $attendance->save();

            /*
            |--------------------------------------------------------------------------
            | Log Only If Status Changed
            |--------------------------------------------------------------------------
            */

            if ($oldStatus != $normalizedStatus) {

                AttendanceLog::create([

                    'attendance_id' => $attendance->id,

                    'old_status' => $oldStatus,

                    'new_status' => $normalizedStatus,

                    'changed_by' => auth()->check() ? auth()->id() : null,

                    'reason' => 'Attendance Updated',

                ]);

            }

        }

        DB::commit();

        return response()->json([

            'status' => true,

            'message' => 'Attendance updated successfully.'

        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ], 500);

    }
}

/**
 * Lock Attendance
 */
public function lockAttendance($id)
{
    try {

        $session = AttendanceSession::find($id);

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance session not found.'

            ], 404);

        }

        if ($session->is_locked) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance is already locked.'

            ], 422);

        }

        $session->is_locked = true;

        $session->verified_by = auth()->check() ? auth()->id() : null;

        $session->save();

        return response()->json([

            'status' => true,

            'message' => 'Attendance locked successfully.'

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ], 500);

    }
}


/**
 * Unlock Attendance
 */
public function unlockAttendance($id)
{
    try {

        $session = AttendanceSession::find($id);

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance session not found.'

            ], 404);

        }

        $session->is_locked = false;

        $session->verified_by = null;

        $session->save();

        return response()->json([

            'status' => true,

            'message' => 'Attendance unlocked successfully.'

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ], 500);

    }
}

/**
 * Deactivate Attendance Session
 */
public function destroy($id)
{
    DB::beginTransaction();

    try {

        $session = AttendanceSession::find($id);

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance session not found.'

            ], 404);

        }

        if ($session->is_locked) {

            return response()->json([

                'status' => false,

                'message' => 'Locked attendance cannot be deactivated.'

            ], 422);

        }

        $session->status = 0;

        $session->save();

        DB::commit();

        return response()->json([

            'status' => true,

            'message' => 'Attendance session deactivated successfully.'

        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ], 500);

    }
}

/**
 * Inactive Attendance Sessions
 */
public function inactive()
{
    try {

        $sessions = AttendanceSession::where('status', 0)
                    ->orderBy('attendance_date', 'DESC')
                    ->paginate(20);

        return response()->json([

            'status' => true,

            'data' => $sessions,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ], 500);

    }
}


/**
 * Restore Attendance Session
 */
public function restore($id)
{
    try {

        $session = AttendanceSession::where('status', 0)->find($id);

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance session not found.'

            ], 404);

        }

        $session->status = 1;

        $session->save();

        return response()->json([

            'status' => true,

            'message' => 'Attendance session restored successfully.'

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ], 500);

    }
}


/**
 * Student Mobile Attendance
 */
public function studentAttendance(Request $request)
{
    try {

        $user = $request->user();

        // Find logged-in student's record
        $student = Student::where('user_id', $user->id)
            ->where('status', 1)
            ->first();

        if (!$student) {
            return response()->json([
                'status' => false,
                'message' => 'Student record not found for this user.',
            ], 404);
        }

        // Get attendance records of this student
        $attendance = StudentAttendance::where(
                'student_id',
                $student->id
            )
            ->with([
                'attendanceSession'
            ])
            ->get()
            ->sortByDesc(function ($record) {
                return optional($record->attendanceSession)->attendance_date;
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Attendance Summary
        |--------------------------------------------------------------------------
        */

        $total = $attendance->count();

        $present = $attendance
            ->whereIn('attendance_status', ['Present', 'P'])
            ->count();

        $absent = $attendance
            ->whereIn('attendance_status', ['Absent', 'A'])
            ->count();

        $late = $attendance
            ->whereIn('attendance_status', ['Late', 'L'])
            ->count();

        $halfDay = $attendance
            ->whereIn('attendance_status', ['Half Day', 'Half-Day', 'HD'])
            ->count();

        $leave = $attendance
            ->whereIn('attendance_status', ['Leave', 'LEAVE', 'LV'])
            ->count();

        $percentage = $total > 0
            ? round(($present / $total) * 100, 2)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Date-wise Attendance
        |--------------------------------------------------------------------------
        */

        $records = $attendance->map(function ($record) {

            $session = $record->attendanceSession;

            return [
                'id' => $record->id,

                'student_id' => $record->student_id,

                'attendance_session_id' =>
                    $record->attendance_session_id,

                'attendance_date' =>
                    optional($session)->attendance_date
                        ? $session->attendance_date->format('Y-m-d')
                        : null,

                'attendance_type' =>
                    optional($session)->attendance_type,

                'attendance_status' =>
                    $record->attendance_status,

                'arrival_time' =>
                    $record->arrival_time,

                'departure_time' =>
                    $record->departure_time,

                'late_minutes' =>
                    $record->late_minutes,

                'remarks' =>
                    $record->remarks,
            ];
        })->values();

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'message' => 'Student attendance loaded successfully.',

            'student' => [
                'id' => $student->id,
                'student_code' => $student->student_code,
                'admission_no' => $student->admission_no,
                'name' => trim(
                    $student->first_name . ' ' .
                    $student->middle_name . ' ' .
                    $student->last_name
                ),
            ],

            'summary' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'half_day' => $halfDay,
                'leave' => $leave,
                'percentage' => $percentage,
            ],

            'attendance' => $records,

        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

}





