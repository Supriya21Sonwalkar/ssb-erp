<?php

namespace App\Http\Controllers\Api\AttendanceManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Barryvdh\DomPDF\Facade as PDF;
use Maatwebsite\Excel\Facades\Excel;

use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Section;
use App\Models\Student;

use App\Models\AttendanceSession;
use App\Models\StudentAttendance;
use App\Models\AttendanceLog;

use App\Exports\AttendanceManagement\DailyAttendanceExport;
use App\Exports\AttendanceManagement\StudentAttendanceExport;
use App\Exports\AttendanceManagement\ClassAttendanceExport;
use App\Exports\AttendanceManagement\MonthlyAttendanceExport;

class AttendanceReportController extends Controller
{

    /**
     * Load Attendance Report Filters
     */
    public function index()
    {
    try {

        /*
        |--------------------------------------------------------------------------
        | Academic Years
        |--------------------------------------------------------------------------
        */

        $academicYears = AcademicYear::orderBy('id', 'DESC')->get();

        /*
        |--------------------------------------------------------------------------
        | Classes
        |--------------------------------------------------------------------------
        */

        $classes = Classes::orderBy('display_order')->get();

        return response()->json([

            'status' => true,

            'message' => 'Attendance report loaded successfully.',

            'data' => [

                'academic_years' => $academicYears,

                'classes' => $classes,

            ]

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
    }

/**
 * Daily Attendance Report
 */
public function dailyReport(Request $request)
{
    $request->validate([

        'academic_year_id' => 'required|integer|exists:academic_years,id',

        'class_id' => 'required|integer|exists:classes,id',

        'section_id' => 'required|integer|exists:sections,id',

        'attendance_date' => 'required|date',

    ]);

    try {

        /*
        |--------------------------------------------------------------------------
        | Attendance Session
        |--------------------------------------------------------------------------
        */

        $session = AttendanceSession::where('status', 1)
            ->where('academic_year_id', $request->academic_year_id)
            ->where('class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->whereDate('attendance_date', $request->attendance_date)
            ->first();

        if (!$session) {

            return response()->json([

                'status' => false,

                'message' => 'Attendance not found.'

            ],404);

        }

        /*
        |--------------------------------------------------------------------------
        | Attendance Records
        |--------------------------------------------------------------------------
        */

        $attendance = StudentAttendance::with('student')
            ->where('attendance_session_id', $session->id)
            ->orderBy('student_id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $totalStudents = $attendance->count();

        $present = $attendance->whereIn('attendance_status',['Present','P'])->count();

        $absent = $attendance->whereIn('attendance_status',['Absent','A'])->count();

        $late = $attendance->whereIn('attendance_status',['Late','L'])->count();

        $halfDay = $attendance->whereIn('attendance_status',['Half-Day','HD'])->count();

        $percentage = $totalStudents > 0
            ? round(($present / $totalStudents) * 100,2)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Student List
        |--------------------------------------------------------------------------
        */

        $students = [];

        foreach ($attendance as $record) {

            if (!$record->student) {
                continue;
            }

            $student = $record->student;

            $students[] = [

                'attendance_id' => $record->id,

                'student_id' => $student->id,

                'student_code' => $student->student_code ?? null,

                'admission_no' => $student->admission_no,

                'roll_no' => $student->roll_no,

                'student_name' => trim(

                    $student->first_name.' '.
                    $student->middle_name.' '.
                    $student->last_name

                ),

                'attendance_status' => $record->attendance_status,

                'arrival_time' => $record->arrival_time,

                'departure_time' => $record->departure_time,

                'late_minutes' => $record->late_minutes,

                'remarks' => $record->remarks,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'message' => 'Daily attendance report generated successfully.',

            'summary' => [

                'attendance_session_id' => $session->id,

                'attendance_date' => $session->attendance_date,

                'academic_year_id' => $session->academic_year_id,

                'class_id' => $session->class_id,

                'section_id' => $session->section_id,

                'total_students' => $totalStudents,

                'present' => $present,

                'absent' => $absent,

                'late' => $late,

                'half_day' => $halfDay,

                'attendance_percentage' => $percentage,

                'is_locked' => $session->is_locked,

            ],

            'students' => $students,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
}

/**
 * Student Wise Attendance Report
 */
public function studentWiseReport(Request $request)
{
    $request->validate([

        'student_id' => 'required|integer|exists:students,id',

        'from_date' => 'required|date',

        'to_date' => 'required|date|after_or_equal:from_date',

    ]);

    try {

        /*
        |--------------------------------------------------------------------------
        | Student Details
        |--------------------------------------------------------------------------
        */

        $student = Student::find($request->student_id);

        if (!$student) {

            return response()->json([

                'status' => false,

                'message' => 'Student not found.'

            ],404);

        }

        /*
        |--------------------------------------------------------------------------
        | Attendance Records
        |--------------------------------------------------------------------------
        */

        $attendance = StudentAttendance::with('attendanceSession')
            ->where('student_id', $request->student_id)
            ->whereHas('attendanceSession', function ($query) use ($request) {

                $query->where('status',1)
                    ->whereBetween(
                        'attendance_date',
                        [
                            $request->from_date,
                            $request->to_date
                        ]
                    );

            })
            ->orderBy('id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $totalDays = $attendance->count();

        $present = $attendance->whereIn('attendance_status',['Present','P'])->count();

        $absent = $attendance->whereIn('attendance_status',['Absent','A'])->count();

        $late = $attendance->whereIn('attendance_status',['Late','L'])->count();

        $halfDay = $attendance->whereIn('attendance_status',['Half-Day','HD'])->count();

        $percentage = $totalDays > 0
            ? round(($present / $totalDays) * 100,2)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Attendance List
        |--------------------------------------------------------------------------
        */

        $records = [];

        foreach ($attendance as $record) {

            $records[] = [

                'attendance_date' => optional($record->attendanceSession)->attendance_date,

                'attendance_status' => $record->attendance_status,

                'arrival_time' => $record->arrival_time,

                'departure_time' => $record->departure_time,

                'late_minutes' => $record->late_minutes,

                'remarks' => $record->remarks,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'message' => 'Student attendance report generated successfully.',

            'student' => [

                'student_id' => $student->id,

                'student_code' => $student->student_code ?? null,

                'admission_no' => $student->admission_no,

                'roll_no' => $student->roll_no,

                'student_name' => trim(

                    $student->first_name.' '.
                    $student->middle_name.' '.
                    $student->last_name

                ),

                'class_id' => $student->class_id,

                'section_id' => $student->section_id,

            ],

            'summary' => [

                'from_date' => $request->from_date,

                'to_date' => $request->to_date,

                'total_days' => $totalDays,

                'present' => $present,

                'absent' => $absent,

                'late' => $late,

                'half_day' => $halfDay,

                'attendance_percentage' => $percentage,

            ],

            'attendance' => $records,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
}

/**
 * Class Wise Attendance Report
 */
public function classWiseReport(Request $request)
{
    $request->validate([

        'academic_year_id' => 'required|integer|exists:academic_years,id',

        'class_id' => 'required|integer|exists:classes,id',

        'section_id' => 'required|integer|exists:sections,id',

        'from_date' => 'required|date',

        'to_date' => 'required|date|after_or_equal:from_date',

    ]);

    try {

        /*
        |--------------------------------------------------------------------------
        | Class Students
        |--------------------------------------------------------------------------
        */

        $students = Student::where('academic_year_id', $request->academic_year_id)
            ->where('class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->where('status',1)
            ->orderBy('roll_no')
            ->get();

        if ($students->isEmpty()) {

            return response()->json([

                'status' => false,

                'message' => 'No students found.'

            ],404);

        }

        /*
        |--------------------------------------------------------------------------
        | Prepare Report
        |--------------------------------------------------------------------------
        */

        $report = [];

        $classPresent = 0;

        $classAbsent = 0;

        $classLate = 0;

        $classHalfDay = 0;

        foreach ($students as $student) {

            $attendance = StudentAttendance::with('attendanceSession')
                ->where('student_id',$student->id)
                ->whereHas('attendanceSession',function($query) use($request){

                    $query->where('status',1)
                        ->whereBetween('attendance_date',[
                            $request->from_date,
                            $request->to_date
                        ]);

                })
                ->get();

            $present = $attendance->whereIn('attendance_status',['Present','P'])->count();

            $absent = $attendance->whereIn('attendance_status',['Absent','A'])->count();

            $late = $attendance->whereIn('attendance_status',['Late','L'])->count();

            $halfDay = $attendance->whereIn('attendance_status',['Half-Day','HD'])->count();

            $total = $attendance->count();

            $percentage = $total > 0
                ? round(($present/$total)*100,2)
                : 0;

            $classPresent += $present;

            $classAbsent += $absent;

            $classLate += $late;

            $classHalfDay += $halfDay;

            $report[] = [

                'student_id' => $student->id,

                'student_code' => $student->student_code ?? null,

                'roll_no' => $student->roll_no,

                'admission_no' => $student->admission_no,

                'student_name' => trim(

                    $student->first_name.' '.

                    $student->middle_name.' '.

                    $student->last_name

                ),

                'present' => $present,

                'absent' => $absent,

                'late' => $late,

                'half_day' => $halfDay,

                'attendance_percentage' => $percentage,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'message' => 'Class attendance report generated successfully.',

            'summary' => [

                'academic_year_id' => $request->academic_year_id,

                'class_id' => $request->class_id,

                'section_id' => $request->section_id,

                'from_date' => $request->from_date,

                'to_date' => $request->to_date,

                'total_students' => $students->count(),

                'total_present' => $classPresent,

                'total_absent' => $classAbsent,

                'total_late' => $classLate,

                'total_half_day' => $classHalfDay,

            ],

            'students' => $report,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
}

/**
 * Monthly Attendance Register
 */
public function monthlyReport(Request $request)
{
    $request->validate([

        'academic_year_id' => 'required|integer|exists:academic_years,id',

        'class_id' => 'required|integer|exists:classes,id',

        'section_id' => 'required|integer|exists:sections,id',

        'month' => 'required|integer|min:1|max:12',

        'year' => 'required|integer',

    ]);

    try {

        /*
        |--------------------------------------------------------------------------
        | Load Students
        |--------------------------------------------------------------------------
        */

        $students = Student::where('academic_year_id', $request->academic_year_id)
            ->where('class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->where('status',1)
            ->orderBy('roll_no')
            ->get();

        if ($students->isEmpty()) {

            return response()->json([

                'status' => false,

                'message' => 'No students found.'

            ],404);

        }

        /*
        |--------------------------------------------------------------------------
        | Month Details
        |--------------------------------------------------------------------------
        */

        $daysInMonth = cal_days_in_month(

            CAL_GREGORIAN,

            $request->month,

            $request->year

        );

        /*
        |--------------------------------------------------------------------------
        | Attendance Sessions
        |--------------------------------------------------------------------------
        */

        $sessions = AttendanceSession::where('status',1)
            ->where('academic_year_id',$request->academic_year_id)
            ->where('class_id',$request->class_id)
            ->where('section_id',$request->section_id)
            ->whereMonth('attendance_date',$request->month)
            ->whereYear('attendance_date',$request->year)
            ->pluck('id');

        /*
        |--------------------------------------------------------------------------
        | Attendance Records
        |--------------------------------------------------------------------------
        */

        $attendance = StudentAttendance::whereIn(
                'attendance_session_id',
                $sessions
            )
            ->with('attendanceSession')
            ->get()
            ->groupBy('student_id');

        /*
        |--------------------------------------------------------------------------
        | Prepare Register
        |--------------------------------------------------------------------------
        */

        $register = [];

        foreach ($students as $student) {

            $records = $attendance->get($student->id, collect());

            $days = [];

            $present = 0;

            $absent = 0;

            $late = 0;

            $halfDay = 0;

            for ($day = 1; $day <= $daysInMonth; $day++) {

                $date = sprintf(
                    "%04d-%02d-%02d",
                    $request->year,
                    $request->month,
                    $day
                );

                $record = $records->first(function ($item) use ($date) {

                    return optional(
                        $item->attendanceSession
                    )->attendance_date == $date;

                });

                if ($record) {

                    $days[$day] = $record->attendance_status;

                    switch ($record->attendance_status) {

                        case 'Present':
                            $present++;
                            break;

                        case 'Absent':
                            $absent++;
                            break;

                        case 'Late':
                            $late++;
                            break;

                        case 'Half-Day':
                            $halfDay++;
                            break;

                    }

                } else {

                    $days[$day] = '-';

                }

            }

            $total = $present + $absent + $late + $halfDay;

            $percentage = $total > 0
                ? round(($present/$total)*100,2)
                : 0;

            $register[] = [

                'student_id' => $student->id,

                'roll_no' => $student->roll_no,

                'admission_no' => $student->admission_no,

                'student_name' => trim(

                    $student->first_name.' '.

                    $student->middle_name.' '.

                    $student->last_name

                ),

                'attendance' => $days,

                'present' => $present,

                'absent' => $absent,

                'late' => $late,

                'half_day' => $halfDay,

                'attendance_percentage' => $percentage,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'message' => 'Monthly attendance register generated successfully.',

            'month' => $request->month,

            'year' => $request->year,

            'days' => range(1,$daysInMonth),

            'students' => $register,

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
}

/**
 * Attendance Summary Dashboard
 */
public function attendanceSummary(Request $request)
{
    $request->validate([

        'academic_year_id' => 'required|integer|exists:academic_years,id',

        'class_id' => 'required|integer|exists:classes,id',

        'section_id' => 'required|integer|exists:sections,id',

        'attendance_date' => 'required|date',

    ]);

    try {

        /*
        |--------------------------------------------------------------------------
        | Total Active Students
        |--------------------------------------------------------------------------
        */

        $totalStudents = Student::where('academic_year_id', $request->academic_year_id)
            ->where('class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->where('status', 1)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Attendance Session
        |--------------------------------------------------------------------------
        */

        $session = AttendanceSession::where('status',1)
            ->where('academic_year_id', $request->academic_year_id)
            ->where('class_id', $request->class_id)
            ->where('section_id', $request->section_id)
            ->whereDate('attendance_date', $request->attendance_date)
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Attendance Not Marked
        |--------------------------------------------------------------------------
        */

        if (!$session) {

            return response()->json([

                'status' => true,

                'attendance_marked' => false,

                'summary' => [

                    'total_students' => $totalStudents,

                    'present' => 0,

                    'absent' => 0,

                    'late' => 0,

                    'half_day' => 0,

                    'attendance_percentage' => 0,

                    'is_locked' => false,

                ]

            ]);

        }

        /*
        |--------------------------------------------------------------------------
        | Attendance Records
        |--------------------------------------------------------------------------
        */

        $attendance = StudentAttendance::where(
            'attendance_session_id',
            $session->id
        )->get();

        $present = $attendance->whereIn('attendance_status',['Present','P'])->count();

        $absent = $attendance->whereIn('attendance_status',['Absent','A'])->count();

        $late = $attendance->whereIn('attendance_status',['Late','L'])->count();

        $halfDay = $attendance->whereIn('attendance_status',['Half-Day','HD'])->count();

        /*
        |--------------------------------------------------------------------------
        | Percentage
        |--------------------------------------------------------------------------
        */

        $percentage = $totalStudents > 0
            ? round(($present / $totalStudents) * 100,2)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'status' => true,

            'attendance_marked' => true,

            'summary' => [

                'attendance_session_id' => $session->id,

                'attendance_date' => $session->attendance_date,

                'academic_year_id' => $session->academic_year_id,

                'class_id' => $session->class_id,

                'section_id' => $session->section_id,

                'total_students' => $totalStudents,

                'present' => $present,

                'absent' => $absent,

                'late' => $late,

                'half_day' => $halfDay,

                'attendance_percentage' => $percentage,

                'is_locked' => (bool) $session->is_locked,

                'remarks' => $session->remarks,

            ]

        ]);

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
}

/**
 * Export Attendance Report
 */
public function exportExcel(Request $request)
{
    $request->validate([

        'report_type' => 'required|in:daily,student,class,monthly',

    ]);

    try {

        switch ($request->report_type) {

            /*
            |--------------------------------------------------------------------------
            | Daily Attendance
            |--------------------------------------------------------------------------
            */

            case 'daily':

                return Excel::download(

                    new DailyAttendanceExport($request),

                    'Daily_Attendance_Report.xlsx'

                );

            /*
            |--------------------------------------------------------------------------
            | Student Attendance
            |--------------------------------------------------------------------------
            */

            case 'student':

                return Excel::download(

                    new StudentAttendanceExport($request),

                    'Student_Attendance_Report.xlsx'

                );

            /*
            |--------------------------------------------------------------------------
            | Class Attendance
            |--------------------------------------------------------------------------
            */

            case 'class':

                return Excel::download(

                    new ClassAttendanceExport($request),

                    'Class_Attendance_Report.xlsx'

                );

            /*
            |--------------------------------------------------------------------------
            | Monthly Attendance
            |--------------------------------------------------------------------------
            */

            case 'monthly':

                return Excel::download(

                    new MonthlyAttendanceExport($request),

                    'Monthly_Attendance_Register.xlsx'

                );

        }

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage()

        ],500);

    }
}

/**
 * Export Attendance Report PDF
 */
public function exportPdf(Request $request)
{
    $request->validate([

        'report_type' => 'required|in:daily,student,class,monthly',

    ]);

    try {

        switch ($request->report_type) {

            /*
            |--------------------------------------------------------------------------
            | Daily Attendance Report
            |--------------------------------------------------------------------------
            */

            case 'daily':

                $data = $this->dailyReport($request)->getData(true);

                $pdf = PDF::loadView(
                    'exports.attendance.daily',
                    $data
                );

                return $pdf->download('Daily_Attendance_Report.pdf');

            /*
            |--------------------------------------------------------------------------
            | Student Attendance Report
            |--------------------------------------------------------------------------
            */

            case 'student':

                $data = $this->studentWiseReport($request)->getData(true);

                $pdf = PDF::loadView(
                    'exports.attendance.student',
                    $data
                );

                return $pdf->download('Student_Attendance_Report.pdf');

            /*
            |--------------------------------------------------------------------------
            | Class Attendance Report
            |--------------------------------------------------------------------------
            */

            case 'class':

                $data = $this->classWiseReport($request)->getData(true);

                $pdf = PDF::loadView(
                    'exports.attendance.class',
                    $data
                );

                return $pdf->download('Class_Attendance_Report.pdf');

            /*
            |--------------------------------------------------------------------------
            | Monthly Attendance Register
            |--------------------------------------------------------------------------
            */

            case 'monthly':

                $data = $this->monthlyReport($request)->getData(true);

                $pdf = PDF::loadView(
                    'exports.attendance.monthly',
                    $data
                );

                return $pdf->setPaper('a4', 'landscape')
                           ->download('Monthly_Attendance_Register.pdf');

        }

    } catch (\Exception $e) {

        return response()->json([

            'status' => false,

            'message' => $e->getMessage(),

        ], 500);

    }
}

}