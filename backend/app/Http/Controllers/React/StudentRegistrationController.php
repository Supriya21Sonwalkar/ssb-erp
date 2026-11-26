<?php

namespace App\Http\Controllers\React;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use App\Models\Student;
use App\Models\ParentModel;
use App\Models\StudentParent;
use App\Models\StudentDocument;
use App\Models\FeePayment;
use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Section;
use App\Models\Course;

class StudentRegistrationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Generate Student Code
    |--------------------------------------------------------------------------
    */

    private function generateStudentCode()
    {
        $lastStudent = Student::orderBy('id', 'desc')->first();

        if (!$lastStudent) {
            return 'STU00001';
        }

        $number = (int) substr($lastStudent->student_code, 3);
        $number++;

        return 'STU' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Admission Number
    |--------------------------------------------------------------------------
    */

    private function generateAdmissionNumber()
    {
        $year = date('Y');

        $lastStudent = Student::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        if (!$lastStudent) {
            return 'ADM' . $year . '00001';
        }

        $lastAdmission = $lastStudent->admission_no;
        $number = (int) substr($lastAdmission, -5);
        $number++;

        return 'ADM' . $year . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Receipt Number
    |--------------------------------------------------------------------------
    */

    private function generateReceiptNo()
    {
        $year = date('Y');
        $prefix = 'RCPT' . $year;

        $lastPayment = FeePayment::where('receipt_no', 'LIKE', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        if (!$lastPayment) {
            return $prefix . '00001';
        }

        $number = (int) substr($lastPayment->receipt_no, -5);
        $number++;

        return $prefix . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    /*
    |--------------------------------------------------------------------------
    | Public Dropdowns for Registration Form
    |--------------------------------------------------------------------------
    */

    public function dropdowns()
    {
        return response()->json([
            'success' => true,
            'courses' => Course::where('is_active', true)
                ->orderBy('order_number')
                ->get(['id', 'title']),
            'academicYears' => AcademicYear::where('status', 1)
                ->orderBy('academic_year')
                ->get(['id', 'academic_year']),
            'classes' => Classes::where('status', 1)
                ->orderBy('class_name')
                ->get(['id', 'class_name']),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Sections by Class (Public)
    |--------------------------------------------------------------------------
    */

    public function sectionsByClass($classId)
    {
        $sections = Section::where('class_id', $classId)
            ->where('status', 1)
            ->orderBy('section_name')
            ->get(['id', 'section_name']);

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Validation Rules (Simplified for public)
    |--------------------------------------------------------------------------
    */

    private function validationRules()
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'admission_date' => 'required|date',
            'admission_type' => 'required',

            'first_name' => 'required|max:100',
            'middle_name' => 'nullable|max:100',
            'last_name' => 'required|max:100',
            'gender' => 'required',
            'dob' => 'required|date',

            'blood_group' => 'nullable',
            'category' => 'nullable',
            'caste' => 'nullable',
            'religion' => 'nullable',
            'nationality' => 'nullable',
            'mother_tongue' => 'nullable',
            'birth_place' => 'nullable',

            'aadhaar_number' => 'nullable|unique:students,aadhaar_number',
            'apaar_id' => 'nullable|unique:students,apaar_id',
            'pen_number' => 'nullable|unique:students,pen_number',

            'previous_school' => 'nullable',

            'transport_required' => 'nullable|boolean',
            'hostel_required' => 'nullable|boolean',

            'photo' => 'nullable|image|max:2048',

            'father_name' => 'required',
            'father_mobile' => 'required',
            'father_email' => 'nullable|email',
            'mother_name' => 'nullable',
            'mother_mobile' => 'nullable',

            'address' => 'nullable',
            'city' => 'nullable',
            'state' => 'nullable',
            'pincode' => 'nullable',

            'advance_amount' => 'required|numeric|min:0',
            'payment_mode' => 'required|in:Cash,UPI,Bank Transfer,Cheque,Card,Online',
            'transaction_reference' => 'nullable',
            'payment_remarks' => 'nullable',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Register Student (Public)
    |--------------------------------------------------------------------------
    */

    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            $this->validationRules()
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $photo = null;
            if ($request->hasFile('photo')) {
                $photo = $request->file('photo')->store('students/profile', 'public');
            }

            $parent = ParentModel::where('father_mobile', $request->father_mobile)
                ->where('father_name', $request->father_name)
                ->first();

            if (!$parent) {
                $parent = ParentModel::create([
                    'father_name'       => $request->father_name,
                    'father_mobile'     => $request->father_mobile,
                    'father_email'      => $request->father_email,
                    'mother_name'       => $request->mother_name,
                    'mother_mobile'     => $request->mother_mobile,
                    'address'           => $request->address,
                    'city'              => $request->city,
                    'state'             => $request->state,
                    'pincode'           => $request->pincode,
                    'status'            => 1,
                    'created_by'        => null,
                    'updated_by'        => null,
                ]);
            }

            $student = Student::create([
                'student_code'        => $this->generateStudentCode(),
                'admission_no'        => $this->generateAdmissionNumber(),
                'roll_no'             => $request->roll_no ?? null,
                'course_id'           => $request->course_id,
                'academic_year_id'    => $request->academic_year_id,
                'class_id'            => $request->class_id,
                'section_id'          => $request->section_id,
                'admission_date'      => $request->admission_date,
                'admission_type'      => $request->admission_type,
                'admission_status'    => 'Registered',
                'first_name'          => $request->first_name,
                'middle_name'         => $request->middle_name,
                'last_name'           => $request->last_name,
                'full_name'           => trim(
                    $request->first_name . ' ' .
                    $request->middle_name . ' ' .
                    $request->last_name
                ),
                'gender'              => $request->gender,
                'dob'                 => $request->dob,
                'blood_group'         => $request->blood_group,
                'category'            => $request->category,
                'caste'               => $request->caste,
                'religion'            => $request->religion,
                'nationality'         => $request->nationality ?? 'Indian',
                'mother_tongue'       => $request->mother_tongue,
                'birth_place'         => $request->birth_place,
                'aadhaar_number'      => $request->aadhaar_number,
                'apaar_id'            => $request->apaar_id,
                'pen_number'          => $request->pen_number,
                'previous_school'     => $request->previous_school,
                'transport_required'  => $request->transport_required ?? 0,
                'hostel_required'     => $request->hostel_required ?? 0,
                'photo'               => $photo,
                'remarks'             => $request->remarks ?? null,
                'status'              => 1,
                'is_self_registered'  => true,
                'registration_source' => 'website',
                'advance_amount_paid' => $request->advance_amount,
                'created_by'          => null,
                'updated_by'          => null,
            ]);

            StudentParent::create([
                'student_id' => $student->id,
                'parent_id'  => $parent->id,
            ]);

            if ($request->advance_amount > 0) {
                FeePayment::create([
                    'student_id'          => $student->id,
                    'course_id'           => $request->course_id,
                    'fee_structure_id'    => null,
                    'receipt_no'          => $this->generateReceiptNo(),
                    'payment_date'        => date('Y-m-d'),
                    'amount'              => $request->advance_amount,
                    'payment_mode'        => $request->payment_mode,
                    'transaction_reference' => $request->transaction_reference,
                    'cheque_no'           => null,
                    'bank_name'           => null,
                    'remarks'             => ($request->payment_remarks ?? 'Registration Token / Advance Payment') . ' (Self-Registered)',
                    'status'              => 'Success',
                    'received_by'         => null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Student Registered Successfully. Your admission no: ' . $student->admission_no,
                'data'    => [
                    'student'      => $student,
                    'admission_no' => $student->admission_no,
                    'student_code' => $student->student_code,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
