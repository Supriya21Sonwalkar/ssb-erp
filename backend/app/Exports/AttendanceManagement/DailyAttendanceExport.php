<?php

namespace App\Exports\AttendanceManagement;

use App\Models\AttendanceSession;
use App\Models\StudentAttendance;

use Illuminate\Http\Request;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DailyAttendanceExport implements
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
     * Export Data
     */
    public function collection()
    {

        $session = AttendanceSession::where('status',1)

            ->where('academic_year_id',$this->request->academic_year_id)

            ->where('class_id',$this->request->class_id)

            ->where('section_id',$this->request->section_id)

            ->whereDate('attendance_date',$this->request->attendance_date)

            ->first();

        if(!$session){

            return collect();

        }

        return StudentAttendance::with('student')

            ->where('attendance_session_id',$session->id)

            ->get()

            ->map(function($attendance){

                return [

                    'Admission No' => optional($attendance->student)->admission_no,

                    'Roll No' => optional($attendance->student)->roll_no,

                    'Student Name' => trim(

                        optional($attendance->student)->first_name.' '.

                        optional($attendance->student)->middle_name.' '.

                        optional($attendance->student)->last_name

                    ),

                    'Attendance' => $this->getAttendanceStatusName($attendance->attendance_status),

                    // 'Arrival Time' => $attendance->arrival_time,

                    // 'Departure Time' => $attendance->departure_time,

                    'Remarks' => $attendance->remarks,

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

            'Attendance',

            // 'Arrival Time',

            // 'Departure Time',

            'Remarks',

        ];

    }

    /**
     * Styling
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

    /**
     * Get Attendance Status Name
     */
    private function getAttendanceStatusName($status)
    {
        switch ($status) {
            case 'Present':
            case 'P':
                return 'Present';
            case 'Absent':
            case 'A':
                return 'Absent';
            case 'Late':
            case 'L':
                return 'Late';
            case 'Half-Day':
            case 'HD':
                return 'Half-Day';
            default:
                return $status;
        }
    }

}