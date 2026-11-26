<?php

namespace App\Exports\AttendanceManagement;

use App\Models\Student;
use App\Models\StudentAttendance;

use Illuminate\Http\Request;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ClassAttendanceExport implements
    FromCollection,
    WithHeadings,
    ShouldAutoSize,
    WithStyles
{

    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Export Collection
     */
    public function collection()
    {

        $students = Student::where('academic_year_id', $this->request->academic_year_id)
            ->where('class_id', $this->request->class_id)
            ->where('section_id', $this->request->section_id)
            ->where('status', 1)
            ->orderBy('roll_no')
            ->get();

        return $students->map(function ($student) {

            $attendance = StudentAttendance::with('attendanceSession')
                ->where('student_id', $student->id)
                ->whereHas('attendanceSession', function ($query) {

                    $query->where('status', 1)
                        ->whereBetween('attendance_date', [

                            $this->request->from_date,

                            $this->request->to_date

                        ]);

                })
                ->get();

            $present = $attendance->where('attendance_status', 'Present')->count();

            $absent = $attendance->where('attendance_status', 'Absent')->count();

            $late = $attendance->where('attendance_status', 'Late')->count();

            $halfDay = $attendance->where('attendance_status', 'Half-Day')->count();

            $total = $attendance->count();

            $percentage = $total > 0
                ? round(($present / $total) * 100, 2)
                : 0;

            return [

                'Admission No' => $student->admission_no,

                'Roll No' => $student->roll_no,

                'Student Name' => trim(

                    $student->first_name . ' ' .

                    $student->middle_name . ' ' .

                    $student->last_name

                ),

                'Present' => $present,

                'Absent' => $absent,

                'Late' => $late,

                'Half Day' => $halfDay,

                'Attendance %' => $percentage,

            ];

        });

    }

    /**
     * Excel Headers
     */
    public function headings(): array
    {

        return [

            'Admission No',

            'Roll No',

            'Student Name',

            'Present',

            'Absent',

            'Late',

            'Half Day',

            'Attendance %',

        ];

    }

    /**
     * Excel Styling
     */
    public function styles(Worksheet $sheet)
    {

        return [

            1 => [

                'font' => [

                    'bold' => true,

                    'size' => 12,

                ],

            ],

        ];

    }

}