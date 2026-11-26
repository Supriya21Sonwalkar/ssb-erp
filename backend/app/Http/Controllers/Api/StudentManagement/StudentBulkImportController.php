<?php

namespace App\Http\Controllers\Api\StudentManagement;

use App\Http\Controllers\Controller;
use App\Exports\StudentManagement\StudentSampleExport;
use App\Imports\StudentManagement\StudentImport;

use App\Models\Student;
use App\Models\User;
use App\Models\Role;
use App\Models\ParentModel;
use App\Models\StudentParent;
use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Section;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

use Maatwebsite\Excel\Facades\Excel;

class StudentBulkImportController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Download Sample Excel
    |--------------------------------------------------------------------------
    */

    public function downloadSample()
    {
        return Excel::download(
            new StudentSampleExport(),
            'Student_Registration_Template.xlsx'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Upload Excel
    |--------------------------------------------------------------------------
    */

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please upload a valid Excel file.',
                'errors' => $validator->errors(),
            ], 422);
        }

        return response()->json([
            'status' => true,
            'message' => 'File uploaded successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Preview Excel
    |--------------------------------------------------------------------------
    */

    public function preview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please upload a valid Excel file.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {

            /*
            |--------------------------------------------------------------------------
            | Read Excel
            |--------------------------------------------------------------------------
            |
            | IMPORTANT:
            | This method ONLY reads and validates the Excel.
            |
            | NO database INSERT / UPDATE / DELETE is performed here.
            |
            */

            $import = new StudentImport();

            Excel::import(
                $import,
                $request->file('file')
            );

            $rows = $import->getRows();

            $previewRows = [];

            /*
            |--------------------------------------------------------------------------
            | Duplicate Tracking Inside Excel
            |--------------------------------------------------------------------------
            */

            $studentCodes = [];
            $admissionNos = [];
            $emails = [];
            $aadhaarNumbers = [];

            /*
            |--------------------------------------------------------------------------
            | Validate Each Row
            |--------------------------------------------------------------------------
            */

            foreach ($rows as $index => $rawRow) {

                $rowNumber = $index + 2;

                /*
                |--------------------------------------------------------------------------
                | Normalize Row
                |--------------------------------------------------------------------------
                */

                $row = $this->normalizeImportRow($rawRow);

                $errors = [];

                /*
                |--------------------------------------------------------------------------
                | Required Fields
                |--------------------------------------------------------------------------
                */

                if (empty(trim((string) ($row['course'] ?? ''))) &&
                    empty($row['course_id'])) {

                    $errors['course'] = 'Course is required.';
                }

                if (empty(trim((string) ($row['academic_year'] ?? ''))) &&
                    empty($row['academic_year_id'])) {

                    $errors['academic_year'] =
                        'Academic year is required.';
                }

                if (empty(trim((string) ($row['class'] ?? ''))) &&
                    empty($row['class_id'])) {

                    $errors['class'] = 'Class is required.';
                }

                if (empty(trim((string) ($row['section'] ?? ''))) &&
                    empty($row['section_id'])) {

                    $errors['section'] = 'Section is required.';
                }

                if (empty(trim((string) ($row['student_code'] ?? '')))) {

                    $errors['student_code'] =
                        'Student code is required.';
                }

                if (empty(trim((string) ($row['admission_no'] ?? '')))) {

                    $errors['admission_no'] =
                        'Admission number is required.';
                }

                if (empty(trim((string) ($row['first_name'] ?? '')))) {

                    $errors['first_name'] =
                        'First name is required.';
                }

                if (empty(trim((string) ($row['last_name'] ?? '')))) {

                    $errors['last_name'] =
                        'Last name is required.';
                }

                if (empty(trim((string) ($row['gender'] ?? '')))) {

                    $errors['gender'] =
                        'Gender is required.';
                }

                if (empty($row['dob'])) {

                    $errors['dob'] =
                        'Date of birth is required.';

                } else {

                    if (!$this->isValidImportDate($row['dob'])) {

                        $errors['dob'] =
                            'Invalid date. Use DD-MM-YYYY.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Date
                |--------------------------------------------------------------------------
                */

                if (empty($row['admission_date'])) {

                    $errors['admission_date'] =
                        'Admission date is required.';

                } else {

                    if (!$this->isValidImportDate(
                        $row['admission_date']
                    )) {

                        $errors['admission_date'] =
                            'Invalid date. Use DD-MM-YYYY.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Father Birth Date
                |--------------------------------------------------------------------------
                */

                if (!empty($row['father_birth_date'])) {

                    if (!$this->isValidImportDate(
                        $row['father_birth_date']
                    )) {

                        $errors['father_birth_date'] =
                            'Invalid date. Use DD-MM-YYYY.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Mother Birth Date
                |--------------------------------------------------------------------------
                */

                if (!empty($row['mother_birth_date'])) {

                    if (!$this->isValidImportDate(
                        $row['mother_birth_date']
                    )) {

                        $errors['mother_birth_date'] =
                            'Invalid date. Use DD-MM-YYYY.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Gender
                |--------------------------------------------------------------------------
                */

                if (!empty($row['gender'])) {

                    $allowedGender = [
                        'Male',
                        'Female',
                        'Other',
                    ];

                    if (!in_array(
                        trim($row['gender']),
                        $allowedGender,
                        true
                    )) {

                        $errors['gender'] =
                            'Gender must be Male, Female or Other.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Type
                |--------------------------------------------------------------------------
                */

                if (!empty($row['admission_type'])) {

                    $allowedAdmissionTypes = [
                        'New Admission',
                        'Re-Admission',
                        'Transfer',
                    ];

                    if (!in_array(
                        trim($row['admission_type']),
                        $allowedAdmissionTypes,
                        true
                    )) {

                        $errors['admission_type'] =
                            'Invalid admission type.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Status
                |--------------------------------------------------------------------------
                */

                if (!empty($row['admission_status'])) {

                    $allowedStatuses = [
                        'Registered',
                        'Promoted',
                        'Demoted',
                        'Transfer',
                    ];

                    if (!in_array(
                        trim($row['admission_status']),
                        $allowedStatuses,
                        true
                    )) {

                        $errors['admission_status'] =
                            'Invalid admission status.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Student Code Duplicate Check
                |--------------------------------------------------------------------------
                */

                $studentCode = trim(
                    (string) ($row['student_code'] ?? '')
                );

                if ($studentCode !== '') {

                    /*
                    | Duplicate inside current Excel
                    */

                    if (isset($studentCodes[$studentCode])) {

                        $errors['student_code'] =
                            'Duplicate student code in Excel.';

                    } else {

                        $studentCodes[$studentCode] =
                            $rowNumber;
                    }

                    /*
                    | Existing database record
                    */

                    if (
                        Student::where(
                            'student_code',
                            $studentCode
                        )->exists()
                    ) {

                        $errors['student_code'] =
                            'Student code already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Number Duplicate Check
                |--------------------------------------------------------------------------
                */

                $admissionNo = trim(
                    (string) ($row['admission_no'] ?? '')
                );

                if ($admissionNo !== '') {

                    if (isset($admissionNos[$admissionNo])) {

                        $errors['admission_no'] =
                            'Duplicate admission number in Excel.';

                    } else {

                        $admissionNos[$admissionNo] =
                            $rowNumber;
                    }

                    if (
                        Student::where(
                            'admission_no',
                            $admissionNo
                        )->exists()
                    ) {

                        $errors['admission_no'] =
                            'Admission number already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Email Duplicate Check
                |--------------------------------------------------------------------------
                */

                $email = trim(
                    (string) ($row['email'] ?? '')
                );

                $email = trim((string) ($row['email'] ?? ''));

                if ($email !== '') {

                    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $errors['email'] = 'Invalid email address.';
                    }

                    $emailKey = strtolower($email);

                    if (isset($emails[$emailKey])) {
                        $errors['email'] = 'Duplicate email in Excel.';
                    } else {
                        $emails[$emailKey] = $rowNumber;
                    }

                    if (User::where('email', $email)->exists()) {
                        $errors['email'] = 'Email already exists.';
                    }
                }


                /*
                |--------------------------------------------------------------------------
                | Aadhaar Number Validation
                |--------------------------------------------------------------------------
                */

                $aadhaarNumber = trim((string) ($row['aadhaar_number'] ?? ''));

                if ($aadhaarNumber !== '') {

                    if (isset($aadhaarNumbers[$aadhaarNumber])) {
                        $errors['aadhaar_number'] = 'Duplicate Aadhaar number in Excel.';
                    } else {
                        $aadhaarNumbers[$aadhaarNumber] = $rowNumber;
                    }

                    if (Student::where('aadhaar_number', $aadhaarNumber)->exists()) {
                        $errors['aadhaar_number'] = 'Aadhaar number already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Course Validation
                |--------------------------------------------------------------------------
                */

                if (!empty($row['course_id'])) {

                    $course = \App\Models\Course::find(
                        $row['course_id']
                    );

                    if (!$course) {

                        $errors['course'] =
                            'Course not found.';
                    }

                } elseif (!empty($row['course'])) {

                    $course = \App\Models\Course::where(
                        'title',
                        trim($row['course'])
                    )->first();

                    if (!$course) {

                        $errors['course'] =
                            'Course not found: ' .
                            trim($row['course']);
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Academic Year Validation
                |--------------------------------------------------------------------------
                */

                $academicYear = null;

                if (!empty($row['academic_year_id'])) {

                    $academicYear = AcademicYear::find(
                        $row['academic_year_id']
                    );

                } elseif (!empty($row['academic_year'])) {

                    $academicYear =
                        AcademicYear::where(
                            'academic_year',
                            trim($row['academic_year'])
                        )->first();
                }

                if (!$academicYear) {

                    $errors['academic_year'] =
                        'Academic year not found.';
                }

                /*
                |--------------------------------------------------------------------------
                | Class Validation
                |--------------------------------------------------------------------------
                */

                $class = null;

                if (!empty($row['class_id'])) {

                    $class = Classes::find(
                        $row['class_id']
                    );

                } elseif (!empty($row['class'])) {

                    $class = Classes::where(
                        'class_name',
                        trim($row['class'])
                    )->first();
                }

                if (!$class) {

                    $errors['class'] =
                        'Class not found.';
                }

                /*
                |--------------------------------------------------------------------------
                | Section Validation
                |--------------------------------------------------------------------------
                */

                $section = null;

                if (!empty($row['section_id'])) {

                    $section = Section::find(
                        $row['section_id']
                    );

                } elseif (
                    !empty($row['section']) &&
                    $class
                ) {

                    $section = Section::where(
                        'section_name',
                        trim($row['section'])
                    )
                    ->where(
                        'class_id',
                        $class->id
                    )
                    ->first();
                }

                if (!$section) {

                    $errors['section'] =
                        'Section not found for selected class.';
                }

                /*
                |--------------------------------------------------------------------------
                | Mobile Validation
                |--------------------------------------------------------------------------
                */

                if (!empty($row['mobile'])) {

                    if (!preg_match(
                        '/^[0-9]{10}$/',
                        trim($row['mobile'])
                    )) {

                        $errors['mobile'] =
                            'Mobile number must contain 10 digits.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Father Mobile
                |--------------------------------------------------------------------------
                */

                if (!empty($row['father_mobile'])) {

                    if (!preg_match(
                        '/^[0-9]{10}$/',
                        trim($row['father_mobile'])
                    )) {

                        $errors['father_mobile'] =
                            'Father mobile must contain 10 digits.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Mother Mobile
                |--------------------------------------------------------------------------
                */

                if (!empty($row['mother_mobile'])) {

                    if (!preg_match(
                        '/^[0-9]{10}$/',
                        trim($row['mother_mobile'])
                    )) {

                        $errors['mother_mobile'] =
                            'Mother mobile must contain 10 digits.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Add Validation Errors To Row
                |--------------------------------------------------------------------------
                */

                $row['_errors'] = $errors;

                $row['_row_number'] = $rowNumber;

                $row['_is_valid'] =
                    count($errors) === 0;

                $previewRows[] = $row;
            }

            /*
            |--------------------------------------------------------------------------
            | Summary
            |--------------------------------------------------------------------------
            */

            $total = count($previewRows);

            $invalid = collect($previewRows)
                ->where('_is_valid', false)
                ->count();

            $valid = $total - $invalid;

            /*
            |--------------------------------------------------------------------------
            | Return Preview
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'status' => true,

                'message' =>
                    'Excel preview generated successfully.',

                'total_records' => $total,

                'valid_records' => $valid,

                'invalid_records' => $invalid,

                'data' => $previewRows,
            ]);

        } catch (\Exception $e) {

            Log::error(
                'Student Excel preview failed',
                [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]
            );

            return response()->json([
                'status' => false,

                'message' =>
                    'Unable to process Excel file: ' .
                    $e->getMessage(),

            ], 500);
        }
    }     
    
    
    /*
    |--------------------------------------------------------------------------
    | Validate Preview Data
    |--------------------------------------------------------------------------
    |
    | This method validates the edited preview data again before
    | the final database import.
    |
    */
    public function validate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid preview data.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = $request->data;

            $validatedRows = [];

            $studentCodes = [];
            $admissionNos = [];
            $emails = [];
            $aadhaarNumbers = [];

            foreach ($data as $index => $rawRow) {

                $rowNumber = $index + 2;

                $row = $this->normalizeImportRow($rawRow);

                $errors = [];

                /*
                |--------------------------------------------------------------------------
                | Required Fields
                |--------------------------------------------------------------------------
                */

                if (
                    empty(trim((string) ($row['course'] ?? ''))) &&
                    empty($row['course_id'])
                ) {
                    $errors['course'] = 'Course is required.';
                }

                if (
                    empty(trim((string) ($row['academic_year'] ?? ''))) &&
                    empty($row['academic_year_id'])
                ) {
                    $errors['academic_year'] = 'Academic year is required.';
                }

                if (
                    empty(trim((string) ($row['class'] ?? ''))) &&
                    empty($row['class_id'])
                ) {
                    $errors['class'] = 'Class is required.';
                }

                if (
                    empty(trim((string) ($row['section'] ?? ''))) &&
                    empty($row['section_id'])
                ) {
                    $errors['section'] = 'Section is required.';
                }

                if (empty(trim((string) ($row['student_code'] ?? '')))) {
                    $errors['student_code'] = 'Student code is required.';
                }

                if (empty(trim((string) ($row['admission_no'] ?? '')))) {
                    $errors['admission_no'] = 'Admission number is required.';
                }

                if (empty(trim((string) ($row['first_name'] ?? '')))) {
                    $errors['first_name'] = 'First name is required.';
                }

                if (empty(trim((string) ($row['last_name'] ?? '')))) {
                    $errors['last_name'] = 'Last name is required.';
                }

                if (empty(trim((string) ($row['gender'] ?? '')))) {
                    $errors['gender'] = 'Gender is required.';
                }

                /*
                |--------------------------------------------------------------------------
                | Date Validation
                |--------------------------------------------------------------------------
                */

                if (empty($row['dob'])) {

                    $errors['dob'] = 'Date of birth is required.';

                } elseif (!$this->isValidImportDate($row['dob'])) {

                    $errors['dob'] = 'Invalid date. Use DD-MM-YYYY.';
                }

                if (empty($row['admission_date'])) {

                    $errors['admission_date'] =
                        'Admission date is required.';

                } elseif (!$this->isValidImportDate($row['admission_date'])) {

                    $errors['admission_date'] =
                        'Invalid date. Use DD-MM-YYYY.';
                }

                /*
                |--------------------------------------------------------------------------
                | Father Birth Date
                |--------------------------------------------------------------------------
                */

                if (!empty($row['father_birth_date'])) {

                    if (!$this->isValidImportDate($row['father_birth_date'])) {

                        $errors['father_birth_date'] =
                            'Invalid date. Use DD-MM-YYYY.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Mother Birth Date
                |--------------------------------------------------------------------------
                */

                if (!empty($row['mother_birth_date'])) {

                    if (!$this->isValidImportDate($row['mother_birth_date'])) {

                        $errors['mother_birth_date'] =
                            'Invalid date. Use DD-MM-YYYY.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Gender
                |--------------------------------------------------------------------------
                */

                if (!empty($row['gender'])) {

                    $allowedGender = [
                        'Male',
                        'Female',
                        'Other',
                    ];

                    if (!in_array(
                        trim($row['gender']),
                        $allowedGender,
                        true
                    )) {

                        $errors['gender'] =
                            'Gender must be Male, Female or Other.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Type
                |--------------------------------------------------------------------------
                */

                if (!empty($row['admission_type'])) {

                    $allowedAdmissionTypes = [
                        'New Admission',
                        'Re-Admission',
                        'Transfer',
                    ];

                    if (!in_array(
                        trim($row['admission_type']),
                        $allowedAdmissionTypes,
                        true
                    )) {

                        $errors['admission_type'] =
                            'Invalid admission type.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Status
                |--------------------------------------------------------------------------
                */

                if (!empty($row['admission_status'])) {

                    $allowedStatuses = [
                        'Registered',
                        'Promoted',
                        'Demoted',
                        'Transfer',
                    ];

                    if (!in_array(
                        trim($row['admission_status']),
                        $allowedStatuses,
                        true
                    )) {

                        $errors['admission_status'] =
                            'Invalid admission status.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Student Code Duplicate Check
                |--------------------------------------------------------------------------
                */

                $studentCode = trim(
                    (string) ($row['student_code'] ?? '')
                );

                if ($studentCode !== '') {

                    if (isset($studentCodes[$studentCode])) {

                        $errors['student_code'] =
                            'Duplicate student code in Excel.';

                    } else {

                        $studentCodes[$studentCode] = $rowNumber;
                    }

                    if (
                        Student::where(
                            'student_code',
                            $studentCode
                        )->exists()
                    ) {

                        $errors['student_code'] =
                            'Student code already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Admission Number Duplicate Check
                |--------------------------------------------------------------------------
                */

                $admissionNo = trim(
                    (string) ($row['admission_no'] ?? '')
                );

                if ($admissionNo !== '') {

                    if (isset($admissionNos[$admissionNo])) {

                        $errors['admission_no'] =
                            'Duplicate admission number in Excel.';

                    } else {

                        $admissionNos[$admissionNo] = $rowNumber;
                    }

                    if (
                        Student::where(
                            'admission_no',
                            $admissionNo
                        )->exists()
                    ) {

                        $errors['admission_no'] =
                            'Admission number already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Email Validation
                |--------------------------------------------------------------------------
                */

                $email = trim(
                    (string) ($row['email'] ?? '')
                );

                if ($email !== '') {

                    if (!filter_var(
                        $email,
                        FILTER_VALIDATE_EMAIL
                    )) {

                        $errors['email'] =
                            'Invalid email address.';
                    }

                    $emailKey = strtolower($email);

                    if (isset($emails[$emailKey])) {

                        $errors['email'] =
                            'Duplicate email in Excel.';

                    } else {

                        $emails[$emailKey] = $rowNumber;
                    }

                    if (User::where('email', $email)->exists()) {

                        $errors['email'] =
                            'Email already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Aadhaar Validation
                |--------------------------------------------------------------------------
                */

                $aadhaarNumber = trim(
                    (string) ($row['aadhaar_number'] ?? '')
                );

                if ($aadhaarNumber !== '') {

                    if (isset($aadhaarNumbers[$aadhaarNumber])) {

                        $errors['aadhaar_number'] =
                            'Duplicate Aadhaar number in Excel.';

                    } else {

                        $aadhaarNumbers[$aadhaarNumber] =
                            $rowNumber;
                    }

                    if (
                        Student::where(
                            'aadhaar_number',
                            $aadhaarNumber
                        )->exists()
                    ) {

                        $errors['aadhaar_number'] =
                            'Aadhaar number already exists.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Course Validation
                |--------------------------------------------------------------------------
                */

                if (!empty($row['course_id'])) {

                    $course = \App\Models\Course::find(
                        $row['course_id']
                    );

                    if (!$course) {

                        $errors['course'] =
                            'Course not found.';
                    }

                } elseif (!empty($row['course'])) {

                    $course = \App\Models\Course::where(
                        'title',
                        trim($row['course'])
                    )->first();

                    if (!$course) {

                        $errors['course'] =
                            'Course not found: ' .
                            trim($row['course']);
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Academic Year Validation
                |--------------------------------------------------------------------------
                */

                $academicYear = null;

                if (!empty($row['academic_year_id'])) {

                    $academicYear = AcademicYear::find(
                        $row['academic_year_id']
                    );

                } elseif (!empty($row['academic_year'])) {

                    $academicYear =
                        AcademicYear::where(
                            'academic_year',
                            trim($row['academic_year'])
                        )->first();
                }

                if (!$academicYear) {

                    $errors['academic_year'] =
                        'Academic year not found.';
                }

                /*
                |--------------------------------------------------------------------------
                | Class Validation
                |--------------------------------------------------------------------------
                */

                $class = null;

                if (!empty($row['class_id'])) {

                    $class = Classes::find(
                        $row['class_id']
                    );

                } elseif (!empty($row['class'])) {

                    $class = Classes::where(
                        'class_name',
                        trim($row['class'])
                    )->first();
                }

                if (!$class) {

                    $errors['class'] =
                        'Class not found.';
                }

                /*
                |--------------------------------------------------------------------------
                | Section Validation
                |--------------------------------------------------------------------------
                */

                $section = null;

                if (!empty($row['section_id'])) {

                    $section = Section::find(
                        $row['section_id']
                    );

                } elseif (
                    !empty($row['section']) &&
                    $class
                ) {

                    $section = Section::where(
                        'section_name',
                        trim($row['section'])
                    )
                    ->where(
                        'class_id',
                        $class->id
                    )
                    ->first();
                }

                if (!$section) {

                    $errors['section'] =
                        'Section not found for selected class.';
                }

                /*
                |--------------------------------------------------------------------------
                | Mobile Validation
                |--------------------------------------------------------------------------
                */

                if (!empty($row['mobile'])) {

                    if (!preg_match(
                        '/^[0-9]{10}$/',
                        trim($row['mobile'])
                    )) {

                        $errors['mobile'] =
                            'Mobile number must contain 10 digits.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Father Mobile
                |--------------------------------------------------------------------------
                */

                if (!empty($row['father_mobile'])) {

                    if (!preg_match(
                        '/^[0-9]{10}$/',
                        trim($row['father_mobile'])
                    )) {

                        $errors['father_mobile'] =
                            'Father mobile must contain 10 digits.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Mother Mobile
                |--------------------------------------------------------------------------
                */

                if (!empty($row['mother_mobile'])) {

                    if (!preg_match(
                        '/^[0-9]{10}$/',
                        trim($row['mother_mobile'])
                    )) {

                        $errors['mother_mobile'] =
                            'Mother mobile must contain 10 digits.';
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Add Validation Errors
                |--------------------------------------------------------------------------
                */

                $row['_errors'] = $errors;

                $row['_row_number'] = $rowNumber;

                $row['_is_valid'] =
                    count($errors) === 0;

                $validatedRows[] = $row;
            }

            /*
            |--------------------------------------------------------------------------
            | Summary
            |--------------------------------------------------------------------------
            */

            $total = count($validatedRows);

            $invalid = collect($validatedRows)
                ->where('_is_valid', false)
                ->count();

            $valid = $total - $invalid;

            return response()->json([
                'status' => true,

                'message' =>
                    $invalid > 0
                        ? 'Validation errors found.'
                        : 'All records are valid.',

                'total_records' => $total,

                'valid_records' => $valid,

                'invalid_records' => $invalid,

                'data' => $validatedRows,
            ]);

        } catch (\Exception $e) {

            Log::error(
                'Student preview validation failed',
                [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]
            );

            return response()->json([
                'status' => false,

                'message' =>
                    'Unable to validate student data: ' .
                    $e->getMessage(),

            ], 500);
        }
    }  

    /*
    |--------------------------------------------------------------------------
    | Import Students
    |--------------------------------------------------------------------------
    */

    public function import(Request $request)
    {
        Log::info('Import request received', [
            'data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Invalid data format.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->data;

        Log::info('Data to import', [
            'count' => count($data),
            'sample' => $data[0] ?? null
        ]);

        /*
        |--------------------------------------------------------------------------
        | Final Backend Validation
        |--------------------------------------------------------------------------
        | Validate again before starting the transaction.
        | This prevents invalid/duplicate data from reaching the database.
        |--------------------------------------------------------------------------
        */

        $validationRequest = new Request([
            'data' => $data,
        ]);

        $validationResponse = $this->validate($validationRequest);

        $validationPayload = $validationResponse->getData(true);

        if (
            !$validationPayload['status'] ||
            ($validationPayload['invalid_records'] ?? 0) > 0
        ) {
            return response()->json([
                'status' => false,
                'message' => 'Please correct all validation errors before importing.',
                'total_records' => $validationPayload['total_records'] ?? count($data),
                'valid_records' => $validationPayload['valid_records'] ?? 0,
                'invalid_records' => $validationPayload['invalid_records'] ?? 0,
                'data' => $validationPayload['data'] ?? [],
            ], 422);
        }

        $data = $validationPayload['data'];

        $imported = 0;
        $failed = 0;
        $errors = [];

        DB::beginTransaction();

        try {

            foreach ($data as $index => $row) {

                try {

                    /*
                    |--------------------------------------------------------------------------
                    | Helper Values
                    |--------------------------------------------------------------------------
                    */

                    $firstName = $row['first_name'] ?? '';
                    $middleName = $row['middle_name'] ?? '';
                    $lastName = $row['last_name'] ?? '';

                    $fullName = trim(
                        $firstName . ' ' .
                        $middleName . ' ' .
                        $lastName
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Course
                    |--------------------------------------------------------------------------
                    */

                    $course = null;

                    if (!empty($row['course_id'])) {

                        $course = \App\Models\Course::find(
                            $row['course_id']
                        );

                    }

                    if (!$course && !empty($row['course'])) {

                        $course = \App\Models\Course::where(
                            'title',
                            trim($row['course'])
                        )->first();

                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Academic Year
                    |--------------------------------------------------------------------------
                    */

                    $academicYear = null;

                    if (!empty($row['academic_year_id'])) {

                        $academicYear = AcademicYear::find(
                            $row['academic_year_id']
                        );

                    }

                    if (!$academicYear && !empty($row['academic_year'])) {

                        $academicYear = AcademicYear::where(
                            'academic_year',
                            trim($row['academic_year'])
                        )->first();

                    }

                    if (!$academicYear) {
                        throw new \Exception(
                            'Academic year not found.'
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Class
                    |--------------------------------------------------------------------------
                    */

                    $class = null;

                    if (!empty($row['class_id'])) {

                        $class = Classes::find(
                            $row['class_id']
                        );
                    }

                    if (!$class && !empty($row['class'])) {

                        $class = Classes::where(
                            'class_name',
                            trim($row['class'])
                        )->first();
                    }

                    if (!$class) {
                        throw new \Exception(
                            'Class not found.'
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Section
                    |--------------------------------------------------------------------------
                    */

                    $section = null;

                    if (!empty($row['section_id'])) {

                        $section = Section::find(
                            $row['section_id']
                        );
                    }

                    if (!$section && !empty($row['section'])) {

                        $section = Section::where(
                            'section_name',
                            trim($row['section'])
                        )
                        ->where('class_id', $class->id)
                        ->first();
                    }

                    if (!$section) {
                        throw new \Exception(
                            'Section not found for selected class.'
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Parent Details
                    |--------------------------------------------------------------------------
                    |
                    | All current parents table fields are covered here.
                    |
                    */

                    $parent = ParentModel::create([

                        // Father
                        'father_name' => $row['father_name'] ?? null,
                        'father_birth_date' => $this->parseDate(
                            $row['father_birth_date'] ?? null
                        ),
                        'father_birth_place' => $row['father_birth_place'] ?? null,
                        'father_religion' => $row['father_religion'] ?? null,
                        'father_mobile' => $row['father_mobile'] ?? null,
                        'father_whatsapp' => $row['father_whatsapp'] ?? null,
                        'father_email' => $row['father_email'] ?? null,
                        'father_pan_election_no' => $row['father_pan_election_no'] ?? null,
                        'father_aadhaar_number' => $row['father_aadhaar_number'] ?? null,
                        'father_occupation' => $row['father_occupation'] ?? null,
                        'father_education_qualification' => $row['father_education_qualification'] ?? null,
                        'father_income' => $row['father_income'] ?? null,

                        // Mother
                        'mother_name' => $row['mother_name'] ?? null,
                        'mother_birth_date' => $this->parseDate(
                            $row['mother_birth_date'] ?? null
                        ),
                        'mother_birth_place' => $row['mother_birth_place'] ?? null,
                        'mother_religion' => $row['mother_religion'] ?? null,
                        'mother_mobile' => $row['mother_mobile'] ?? null,
                        'mother_whatsapp' => $row['mother_whatsapp'] ?? null,
                        'mother_email' => $row['mother_email'] ?? null,
                        'mother_pan_election_no' => $row['mother_pan_election_no'] ?? null,
                        'mother_aadhaar_number' => $row['mother_aadhaar_number'] ?? null,
                        'mother_occupation' => $row['mother_occupation'] ?? null,
                        'mother_education_qualification' => $row['mother_education_qualification'] ?? null,
                        'mother_income' => $row['mother_income'] ?? null,

                        // Guardian
                        'guardian_name' => $row['guardian_name'] ?? null,
                        'guardian_relation' => $row['guardian_relation'] ?? null,
                        'guardian_mobile' => $row['guardian_mobile'] ?? null,

                        // Address
                        'address' => $row['address'] ?? '',
                        'city' => $row['city'] ?? null,
                        'state' => $row['state'] ?? null,
                        'country' => !empty($row['country'])
                            ? $row['country']
                            : 'India',
                        'pincode' => $row['pincode'] ?? null,

                        'status' => isset($row['parent_status'])
                            ? $this->booleanValue($row['parent_status'])
                            : true,

                        'created_by' => auth()->id(),
                        'updated_by' => auth()->id(),
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Student Details
                    |--------------------------------------------------------------------------
                    |
                    | All current students table business fields are covered here.
                    |
                    */

                    $student = Student::create([

                        /*
                        |--------------------------------------------------------------------------
                        | Admission / Identification
                        |--------------------------------------------------------------------------
                        */

                        'student_code' => $row['student_code'] ?? null,
                        'admission_no' => $row['admission_no'] ?? null,
                        'form_no' => $row['form_no'] ?? null,
                        'roll_no' => $row['roll_no'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Academic
                        |--------------------------------------------------------------------------
                        */

                        'course_id' => $course
                            ? $course->id
                            : null,

                        'academic_year_id' => $academicYear->id,

                        'class_id' => $class->id,

                        'section_id' => $section
                            ? $section->id
                            : null,

                        'class_admitted_aws' =>
                            $row['class_admitted_aws'] ?? null,

                        'admission_date' =>
                            $this->parseDate(
                                $row['admission_date'] ?? null
                            ) ?: date('Y-m-d'),

                        'admission_type' =>
                            $row['admission_type'] ??
                            'New Admission',

                        'admission_status' =>
                            $this->getAdmissionStatus(
                                $row['admission_status'] ?? null
                            ),

                        /*
                        |--------------------------------------------------------------------------
                        | Name
                        |--------------------------------------------------------------------------
                        */

                        'first_name' => $firstName,
                        'middle_name' => $middleName ?: null,
                        'last_name' => $lastName,

                        'full_name' => $fullName,

                        /*
                        |--------------------------------------------------------------------------
                        | Personal Details
                        |--------------------------------------------------------------------------
                        */

                        'gender' => $row['gender'] ?? null,

                        'dob' =>
                            $this->parseDate(
                                $row['dob'] ?? null
                            ),

                        'email' => $row['email'] ?? null,

                        'mobile' => $row['mobile'] ?? null,

                        'blood_group' =>
                            $row['blood_group'] ?? null,

                        'category' =>
                            $row['category'] ?? null,

                        'caste' =>
                            $row['caste'] ?? null,

                        'sub_caste' =>
                            $row['sub_caste'] ?? null,

                        'religion' =>
                            $row['religion'] ?? null,

                        'nationality' =>
                            !empty($row['nationality'])
                                ? $row['nationality']
                                : 'Indian',

                        'mother_tongue' =>
                            $row['mother_tongue'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Birth Details
                        |--------------------------------------------------------------------------
                        */

                        'birth_place' =>
                            $row['birth_place'] ?? null,

                        'birth_taluka' =>
                            $row['birth_taluka'] ?? null,

                        'birth_district' =>
                            $row['birth_district'] ?? null,

                        'birth_state' =>
                            $row['birth_state'] ?? null,

                        'birth_country' =>
                            $row['birth_country'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Address / House
                        |--------------------------------------------------------------------------
                        */

                        'house' =>
                            $row['house'] ?? null,

                        'landmark' =>
                            $row['landmark'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Government / Identification
                        |--------------------------------------------------------------------------
                        */

                        'aadhaar_number' =>
                            $row['aadhaar_number'] ?? null,

                        'apaar_id' =>
                            $row['apaar_id'] ?? null,

                        'pen_number' =>
                            $row['pen_number'] ?? null,

                        'birth_certificate_no' =>
                            $row['birth_certificate_no'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Previous School
                        |--------------------------------------------------------------------------
                        */

                        'previous_school' =>
                            $row['previous_school'] ?? null,

                        'previous_school_u_dise_no' =>
                            $row['previous_school_u_dise_no'] ?? null,

                        'previous_school_address' =>
                            $row['previous_school_address'] ?? null,

                        'previous_school_board' =>
                            $row['previous_school_board'] ?? null,

                        'previous_school_class' =>
                            $row['previous_school_class'] ?? null,

                        'previous_school_percentage_grade' =>
                            $row['previous_school_percentage_grade'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Other Student Information
                        |--------------------------------------------------------------------------
                        */

                        'other_illness' =>
                            $row['other_illness'] ?? null,

                        'gr_no' =>
                            $row['gr_no'] ?? null,

                        'sibling_info' =>
                            $row['sibling_info'] ?? null,

                        'saral_id' =>
                            $row['saral_id'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Transport / Hostel
                        |--------------------------------------------------------------------------
                        */

                        'transport_required' =>
                            $this->booleanValue(
                                $row['transport_required'] ?? false
                            ),

                        'hostel_required' =>
                            $this->booleanValue(
                                $row['hostel_required'] ?? false
                            ),

                        /*
                        |--------------------------------------------------------------------------
                        | Photo / Remarks
                        |--------------------------------------------------------------------------
                        */

                        'photo' =>
                            $row['photo'] ?? null,

                        'remarks' =>
                            $row['remarks'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Caution Fee
                        |--------------------------------------------------------------------------
                        */

                        'caution_fee_receipt_no' =>
                            $row['caution_fee_receipt_no'] ?? null,

                        /*
                        |--------------------------------------------------------------------------
                        | Status / Registration
                        |--------------------------------------------------------------------------
                        */

                        'status' =>
                            isset($row['status'])
                                ? $this->booleanValue($row['status'])
                                : true,

                        'is_self_registered' =>
                            isset($row['is_self_registered'])
                                ? $this->booleanValue(
                                    $row['is_self_registered']
                                )
                                : false,

                        'registration_source' =>
                            !empty($row['registration_source'])
                                ? $row['registration_source']
                                : 'admin',

                        'advance_amount_paid' =>
                            !empty($row['advance_amount_paid'])
                                ? $row['advance_amount_paid']
                                : 0,

                        /*
                        |--------------------------------------------------------------------------
                        | Audit
                        |--------------------------------------------------------------------------
                        */

                        'created_by' => auth()->id(),
                        'updated_by' => auth()->id(),
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Link Student and Parent
                    |--------------------------------------------------------------------------
                    */

                    StudentParent::create([
                        'student_id' => $student->id,
                        'parent_id' => $parent->id,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | Create Student Login User
                    |--------------------------------------------------------------------------
                    */

                    if (!empty($row['email'])) {

                        $studentRole = Role::firstOrCreate(
                            [
                                'name' => 'Student',
                                'guard_name' => 'web'
                            ]
                        );

                        $dobForPass = null;

                        if (!empty($row['dob'])) {
                            $parsedDob = $this->parseDate(
                                $row['dob']
                            );

                            if ($parsedDob) {
                                $dobForPass = date(
                                    'dmY',
                                    strtotime($parsedDob)
                                );
                            }
                        }

                        $userPassword =
                            !empty($row['password'])
                                ? $row['password']
                                : (
                                    $dobForPass
                                        ?: 'Student@123'
                                );

                        $user = User::create([
                            'role_id' => $studentRole->id,
                            'name' => trim(
                                $firstName . ' ' . $lastName
                            ),
                            'email' => $row['email'],
                            'mobile' => $row['mobile'] ?? null,
                            'password' => Hash::make(
                                $userPassword
                            ),
                            'status' => 1,
                        ]);

                        $student->update([
                            'user_id' => $user->id,
                        ]);
                    }

                    $imported++;

                    } catch (\Exception $e) {

                        Log::error(
                            'Student import row failed',
                            [
                                'row_number' => $index + 2,
                                'row' => $row,
                                'error' => $e->getMessage(),
                            ]
                        );

                        throw new \Exception(
                            'Row ' .
                            ($index + 2) .
                            ' failed: ' .
                            $e->getMessage()
                        );
                    }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Student records inserted successfully',
                'total' => count($data),
                'imported' => $imported,
                'failed' => $failed,
                'errors' => $errors,
            ]);

            } catch (\Exception $e) {

                DB::rollBack();

                Log::error(
                    'Student bulk import failed',
                    [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]
                );

                return response()->json([
                    'status' => false,
                    'message' => 'Student records could not be imported. Please check the highlighted validation errors and try again.',
                ], 422);
            }
    }

    private function isValidImportDate($value)
    {
        if (empty($value)) {
            return false;
        }

        /*
        |--------------------------------------------------------------------------
        | Excel Date
        |--------------------------------------------------------------------------
        */

        if (is_numeric($value) && $value > 1000) {

            try {

                \PhpOffice\PhpSpreadsheet\Shared\Date::
                    excelToDateTimeObject($value);

                return true;

            } catch (\Exception $e) {

                return false;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | DD-MM-YYYY
        |--------------------------------------------------------------------------
        */

        $value = trim((string) $value);

        $date = \DateTime::createFromFormat(
            'd-m-Y',
            $value
        );

        if (
            $date &&
            $date->format('d-m-Y') === $value
        ) {

            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | Also Accept Excel/Browser Variations
        |--------------------------------------------------------------------------
        */

        $formats = [
            'Y-m-d',
            'd/m/Y',
            'm/d/Y',
            'd.m.Y',
        ];

        foreach ($formats as $format) {

            $date = \DateTime::createFromFormat(
                $format,
                $value
            );

            if (
                $date &&
                $date->format($format) === $value
            ) {

                return true;
            }
        }

        return false;
    }

    private function normalizeImportRow(array $row)
    {
        $normalized = [];

        foreach ($row as $key => $value) {

            /*
            |--------------------------------------------------------------------------
            | Convert Header To Snake Case
            |--------------------------------------------------------------------------
            */

            $normalizedKey = strtolower(
                trim((string) $key)
            );

            /*
            |--------------------------------------------------------------------------
            | Date Header Aliases
            |--------------------------------------------------------------------------
            |
            | Supports:
            |
            | DOB
            | DOB (DD-MM-YYYY)
            |
            | Admission Date
            | Admission Date (DD-MM-YYYY)
            |
            */

            $normalizedKey = preg_replace(
                '/\s*\(DD-MM-YYYY\)\s*/i',
                '',
                $normalizedKey
            );

            $normalizedKey = preg_replace(
                '/[^a-z0-9]+/',
                '_',
                $normalizedKey
            );

            $normalizedKey = trim(
                $normalizedKey,
                '_'
            );

            $normalized[$normalizedKey] = $value;
        }

        return $normalized;
    }
    /*
    |--------------------------------------------------------------------------
    | Parse Date
    |--------------------------------------------------------------------------
    */

    private function parseDate($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {

            /*
            |--------------------------------------------------------------------------
            | Already DateTime
            |--------------------------------------------------------------------------
            */

            if ($value instanceof \DateTimeInterface) {
                return $value->format('Y-m-d');
            }

            /*
            |--------------------------------------------------------------------------
            | Excel Serial Date
            |--------------------------------------------------------------------------
            */

            if (is_numeric($value) && $value > 1000) {

                try {

                    return \PhpOffice\PhpSpreadsheet\Shared\Date
                        ::excelToDateTimeObject($value)
                        ->format('Y-m-d');

                } catch (\Exception $e) {
                    // Continue with string date formats
                }
            }

            /*
            |--------------------------------------------------------------------------
            | String Date
            |--------------------------------------------------------------------------
            */

            $value = trim((string) $value);

            /*
            |--------------------------------------------------------------------------
            | DD/MM/YYYY
            |--------------------------------------------------------------------------
            | Example: 23/03/2007
            |--------------------------------------------------------------------------
            */

            $date = \DateTime::createFromFormat(
                'd/m/Y',
                $value
            );

            if (
                $date &&
                $date->format('d/m/Y') === $value
            ) {
                return $date->format('Y-m-d');
            }

            /*
            |--------------------------------------------------------------------------
            | DD-MM-YYYY
            |--------------------------------------------------------------------------
            | Example: 23-03-2007
            |--------------------------------------------------------------------------
            */

            $date = \DateTime::createFromFormat(
                'd-m-Y',
                $value
            );

            if (
                $date &&
                $date->format('d-m-Y') === $value
            ) {
                return $date->format('Y-m-d');
            }

            /*
            |--------------------------------------------------------------------------
            | YYYY-MM-DD
            |--------------------------------------------------------------------------
            | Example: 2007-03-23
            |--------------------------------------------------------------------------
            */

            $date = \DateTime::createFromFormat(
                'Y-m-d',
                $value
            );

            if (
                $date &&
                $date->format('Y-m-d') === $value
            ) {
                return $date->format('Y-m-d');
            }

            /*
            |--------------------------------------------------------------------------
            | DD.MM.YYYY
            |--------------------------------------------------------------------------
            */

            $date = \DateTime::createFromFormat(
                'd.m.Y',
                $value
            );

            if (
                $date &&
                $date->format('d.m.Y') === $value
            ) {
                return $date->format('Y-m-d');
            }

            /*
            |--------------------------------------------------------------------------
            | Final Fallback
            |--------------------------------------------------------------------------
            */

            $timestamp = strtotime($value);

            if ($timestamp !== false) {
                return date('Y-m-d', $timestamp);
            }

        } catch (\Exception $e) {

            Log::warning(
                'Unable to parse date',
                [
                    'value' => $value,
                    'error' => $e->getMessage(),
                ]
            );
        }

        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Boolean Value
    |--------------------------------------------------------------------------
    */

    private function booleanValue($value)
    {
        if (is_bool($value)) {
            return $value;
        }

        if ($value === null || $value === '') {
            return false;
        }

        $value = strtolower(trim((string) $value));

        return in_array($value, [
            '1',
            'yes',
            'true',
            'y',
            'on',
            'active'
        ], true);
    }

    /*
    |--------------------------------------------------------------------------
    | Admission Status
    |--------------------------------------------------------------------------
    */

    private function getAdmissionStatus($value)
    {
        if (empty($value)) {
            return 'Registered';
        }

        $value = trim($value);

        /*
         * Current table has enum values beginning with:
         * Registered, Promoted, Demoted, Transfer...
         *
         * Only accept known values here so an invalid Excel value
         * does not cause an ENUM database error.
         */

        $allowed = [
            'Registered',
            'Promoted',
            'Demoted',
            'Transfer',
        ];

        return in_array($value, $allowed, true)
            ? $value
            : 'Registered';
    }
}