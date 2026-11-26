<?php

namespace App\Exports\StudentManagement;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class StudentSampleExport implements
    FromArray,
    WithHeadings,
    WithStyles,
    ShouldAutoSize,
    WithTitle
{
    /**
     * Excel Headers
     */
    public function headings(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Admission Details
            |--------------------------------------------------------------------------
            */

            'Course',
            'Academic Year',
            'Class',
            'Section',

            'Student Code',
            'Admission No',
            'Form No',
            'Roll No',

            'Class Admitted AWS',
            'Caution Fee Receipt No',

            'Admission Date (DD-MM-YYYY)',
            'Admission Type',
            'Admission Status',

            /*
            |--------------------------------------------------------------------------
            | Student Details
            |--------------------------------------------------------------------------
            */

            'First Name',
            'Middle Name',
            'Last Name',

            'Gender',
            'DOB (DD-MM-YYYY)',

            'Email',
            'Mobile',
            'Password',

            'Blood Group',
            'Category',
            'Caste',
            'Sub Caste',
            'Religion',
            'Nationality',
            'Mother Tongue',

            /*
            |--------------------------------------------------------------------------
            | Birth Details
            |--------------------------------------------------------------------------
            */

            'Birth Place',
            'Birth Taluka',
            'Birth District',
            'Birth State',
            'Birth Country',

            /*
            |--------------------------------------------------------------------------
            | Other Student Details
            |--------------------------------------------------------------------------
            */

            'House',
            'Landmark',

            'Aadhaar Number',
            'APAAR ID',
            'PEN Number',
            'Birth Certificate No',

            /*
            |--------------------------------------------------------------------------
            | Previous School Details
            |--------------------------------------------------------------------------
            */

            'Previous School',
            'Previous School U-DISE No',
            'Previous School Address',
            'Previous School Board',
            'Previous School Class',
            'Previous School Percentage/Grade',

            /*
            |--------------------------------------------------------------------------
            | Father Details
            |--------------------------------------------------------------------------
            */

            'Father Name',
            'Father Birth Date (DD-MM-YYYY)',
            'Father Birth Place',
            'Father Religion',

            'Father Mobile',
            'Father WhatsApp',
            'Father Email',

            'Father PAN/Election No',
            'Father Aadhaar Number',

            'Father Occupation',
            'Father Education Qualification',
            'Father Income',

            /*
            |--------------------------------------------------------------------------
            | Mother Details
            |--------------------------------------------------------------------------
            */

            'Mother Name',
            'Mother Birth Date (DD-MM-YYYY)',
            'Mother Birth Place',
            'Mother Religion',

            'Mother Mobile',
            'Mother WhatsApp',
            'Mother Email',

            'Mother PAN/Election No',
            'Mother Aadhaar Number',

            'Mother Occupation',
            'Mother Education Qualification',
            'Mother Income',

            /*
            |--------------------------------------------------------------------------
            | Guardian Details
            |--------------------------------------------------------------------------
            */

            'Guardian Name',
            'Guardian Relation',
            'Guardian Mobile',

            /*
            |--------------------------------------------------------------------------
            | Address Details
            |--------------------------------------------------------------------------
            */

            'Address',
            'City',
            'State',
            'Country',
            'Pincode',

            /*
            |--------------------------------------------------------------------------
            | Additional Student Details
            |--------------------------------------------------------------------------
            */

            'Transport Required',
            'Hostel Required',

            'Remarks',
            'Other Illness',
            'GR No',
            'Sibling Info',
            'Saral ID',

        ];
    }

    /**
     * Sample Row
     */
    public function array(): array
    {
        return [];
    }

    /**
     * Excel Styles
     */
    public function styles(Worksheet $sheet)
    {
        /*
        |--------------------------------------------------------------------------
        | Get Last Header Column Dynamically
        |--------------------------------------------------------------------------
        */

        $lastColumn = $sheet->getHighestColumn();

        /*
        |--------------------------------------------------------------------------
        | Header Style
        |--------------------------------------------------------------------------
        */

        $sheet->getStyle(
            'A1:' . $lastColumn . '1'
        )->applyFromArray([

            'font' => [

                'bold' => true,

                'color' => [
                    'rgb' => 'FFFFFF',
                ],

            ],

            'fill' => [

                'fillType' => Fill::FILL_SOLID,

                'startColor' => [
                    'rgb' => '610E1E',
                ],

            ],

            'alignment' => [

                'horizontal' => Alignment::HORIZONTAL_CENTER,

                'vertical' => Alignment::VERTICAL_CENTER,

                'wrapText' => true,

            ],

            'borders' => [

                'allBorders' => [

                    'borderStyle' => Border::BORDER_THIN,

                ],

            ],

        ]);

        /*
        |--------------------------------------------------------------------------
        | Header Height
        |--------------------------------------------------------------------------
        */

        $sheet->getRowDimension(1)->setRowHeight(30);

        /*
        |--------------------------------------------------------------------------
        | Freeze Header
        |--------------------------------------------------------------------------
        */

        $sheet->freezePane('A2');

        /*
        |--------------------------------------------------------------------------
        | Auto Filter
        |--------------------------------------------------------------------------
        */

        $sheet->setAutoFilter(
            'A1:' . $lastColumn . '1'
        );

        return [];
    }

    /**
     * Sheet Name
     */
    public function title(): string
    {
        return 'Student Registration';
    }
}