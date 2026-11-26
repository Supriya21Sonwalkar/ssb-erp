<?php

namespace App\Exports\AttendanceManagement;

use App\Models\Student;
use App\Models\AttendanceSession;
use App\Models\StudentAttendance;

use Illuminate\Http\Request;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MonthlyAttendanceExport implements
    FromArray,
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
    public function array(): array
    {

        $daysInMonth = cal_days_in_month(

            CAL_GREGORIAN,

            $this->request->month,

            $this->request->year

        );

        /*
        |--------------------------------------------------------------------------
        | Students
        |--------------------------------------------------------------------------
        */

        $students = Student::where('academic_year_id',$this->request->academic_year_id)
            ->where('class_id',$this->request->class_id)
            ->where('section_id',$this->request->section_id)
            ->where('status',1)
            ->orderBy('roll_no')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Attendance Sessions
        |--------------------------------------------------------------------------
        */

        $sessions = AttendanceSession::where('status',1)
            ->where('academic_year_id',$this->request->academic_year_id)
            ->where('class_id',$this->request->class_id)
            ->where('section_id',$this->request->section_id)
            ->whereMonth('attendance_date',$this->request->month)
            ->whereYear('attendance_date',$this->request->year)
            ->pluck('id');

        /*
        |--------------------------------------------------------------------------
        | Attendance Records
        |--------------------------------------------------------------------------
        */

        $attendance = StudentAttendance::with('attendanceSession')
            ->whereIn('attendance_session_id',$sessions)
            ->get()
            ->groupBy('student_id');

        /*
        |--------------------------------------------------------------------------
        | Register
        |--------------------------------------------------------------------------
        */

        $rows = [];

        foreach ($students as $student) {

            $records = $attendance->get($student->id, collect());

            $row = [

                $student->admission_no,

                $student->roll_no,

                trim(

                    $student->first_name.' '.

                    $student->middle_name.' '.

                    $student->last_name

                )

            ];

            $present = 0;

            $absent = 0;

            $late = 0;

            $halfDay = 0;

            for($day=1;$day<=$daysInMonth;$day++){

                $date = sprintf(

                    "%04d-%02d-%02d",

                    $this->request->year,

                    $this->request->month,

                    $day

                );

                $record = $records->first(function($item) use($date){

                    return optional(
                        $item->attendanceSession
                    )->attendance_date == $date;

                });

                if($record){

                    switch($record->attendance_status){

                        case 'Present':

                            $row[] = 'P';

                            $present++;

                            break;

                        case 'Absent':

                            $row[] = 'A';

                            $absent++;

                            break;

                        case 'Late':

                            $row[] = 'L';

                            $late++;

                            break;

                        case 'Half-Day':

                            $row[] = 'H';

                            $halfDay++;

                            break;

                        default:

                            $row[] = '-';

                    }

                }else{

                    $row[]='-';

                }

            }

            $total = $present+$absent+$late+$halfDay;

            $percentage = $total>0

                ? round(($present/$total)*100,2)

                :0;

            $row[]=$present;

            $row[]=$absent;

            $row[]=$late;

            $row[]=$halfDay;

            $row[]=$percentage;

            $rows[]=$row;

        }

        return $rows;

    }

    /**
     * Excel Headings
     */
    public function headings(): array
    {

        $days = [];

        $daysInMonth = cal_days_in_month(

            CAL_GREGORIAN,

            $this->request->month,

            $this->request->year

        );

        for($i=1;$i<=$daysInMonth;$i++){

            $days[]=$i;

        }

        return array_merge(

            [

                'Admission No',

                'Roll No',

                'Student Name'

            ],

            $days,

            [

                'Present',

                'Absent',

                'Late',

                'Half Day',

                'Attendance %'

            ]

        );

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

                    'size' => 12

                ]

            ]

        ];

    }

}