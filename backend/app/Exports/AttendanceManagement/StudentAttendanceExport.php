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

class StudentAttendanceExport implements
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

        $attendance = StudentAttendance::with([
            'attendanceSession',
            'student'
        ])
        ->where('student_id', $this->request->student_id)
        ->whereHas('attendanceSession', function ($query) {

            $query->where('status', 1)
                ->whereBetween('attendance_date', [

                    $this->request->from_date,

                    $this->request->to_date

                ]);

        })
        ->orderBy('student_id')
        ->get();

        return $attendance->map(function ($record) {

            return [

                'Attendance Date' => optional($record->attendanceSession)->attendance_date,

                'Admission No' => optional($record->student)->admission_no,

                'Roll No' => optional($record->student)->roll_no,

                'Student Name' => trim(

                    optional($record->student)->first_name . ' ' .

                    optional($record->student)->middle_name . ' ' .

                    optional($record->student)->last_name

                ),

                'Attendance Status' => $record->attendance_status,

                'Arrival Time' => $record->arrival_time,

                'Departure Time' => $record->departure_time,

                'Late Minutes' => $record->late_minutes,

                'Remarks' => $record->remarks,

            ];

        });

    }

    /**
     * Excel Headers
     */
    public function headings(): array
    {

        return [

            'Attendance Date',

            'Admission No',

            'Roll No',

            'Student Name',

            'Attendance Status',

            'Arrival Time',

            'Departure Time',

            'Late Minutes',

            'Remarks',

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