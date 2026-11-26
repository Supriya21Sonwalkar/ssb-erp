<?php

namespace App\Http\Controllers\Api\Course;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\StudentFeeWaiver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FeePaymentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Index - List All Payments
    |--------------------------------------------------------------------------
    |
    | Returns all fee payment records with optional filters.
    |
    | Supports:
    | - Academic Year Filter
    | - Class Filter
    |
    */


    public function index(Request $request)
    {
        try {

            $academicYearId = $request->get('academic_year_id');
            $classId = $request->get('class_id');


            $query = FeePayment::with([
                'student',
                'course',
                'feeStructure.feeComponent',
                'receiver',
            ]);


            if (!empty($academicYearId)) {

                $query->whereHas('student', function ($q) use ($academicYearId) {

                    $q->where('academic_year_id', $academicYearId);

                });

            }


            if (!empty($classId)) {

                $query->whereHas('student', function ($q) use ($classId) {

                    $q->where('class_id', $classId);

                });

            }


            $payments = $query
                ->orderBy('payment_date', 'desc')
                ->orderBy('id', 'desc')
                ->get();


            return response()->json([

                'success' => true,

                'data' => $payments,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to fetch payments.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Search Students
    |--------------------------------------------------------------------------
    |
    | Used by Fees Collection student search.
    |
    | Supports:
    | - Academic Year
    | - First Name
    | - Middle Name
    | - Last Name
    | - Full Name
    | - Admission Number
    |
    */


    public function students(Request $request)
    {
        try {

            $search = trim(
                $request->get('search', '')
            );

            $academicYearId =
                $request->get('academic_year_id');


            /*
            |--------------------------------------------------------------------------
            | Student Query
            |--------------------------------------------------------------------------
            */

            $query = Student::query();


            /*
            |--------------------------------------------------------------------------
            | Academic Year Filter
            |--------------------------------------------------------------------------
            */

            if (!empty($academicYearId)) {

                $query->where(
                    'academic_year_id',
                    $academicYearId
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Search Student
            |--------------------------------------------------------------------------
            */

            if ($search !== '') {

                $query->where(function ($q) use ($search) {

                    $q->where(
                        'first_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'middle_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'last_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'full_name',
                        'like',
                        '%' . $search . '%'
                    )

                    ->orWhere(
                        'admission_no',
                        'like',
                        '%' . $search . '%'
                    );

                });

            }


            /*
            |--------------------------------------------------------------------------
            | Only Active Students
            |--------------------------------------------------------------------------
            */

            $query->where(
                'status',
                1
            );


            /*
            |--------------------------------------------------------------------------
            | Result
            |--------------------------------------------------------------------------
            */

            $students = $query
                ->orderBy('first_name')
                ->limit(20)
                ->get([
                    'id',
                    'course_id',
                    'student_code',
                    'admission_no',
                    'roll_no',
                    'academic_year_id',
                    'class_id',
                    'section_id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'full_name',
                    'photo',
                    'hostel_required',
                ]);


            return response()->json([

                'success' => true,

                'data' => $students,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to search students.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Student Fee Details
    |--------------------------------------------------------------------------
    |
    | Returns:
    |
    | Student profile
    | Course
    | Academic Year
    | Fee Structure
    | Total Fee
    | Waiver
    | Net Payable
    | Total Paid
    | Due Amount
    | All Transactions
    |
    */


    public function studentDetails($studentId)
    {
        try {

            /*
            |--------------------------------------------------------------------------
            | Student
            |--------------------------------------------------------------------------
            */

            $student =
                Student::findOrFail(
                    $studentId
                );


            /*
            |--------------------------------------------------------------------------
            | Student Course
            |--------------------------------------------------------------------------
            */

            $courseId =
                $student->course_id;


            /*
            |--------------------------------------------------------------------------
            | Student Academic Year
            |--------------------------------------------------------------------------
            */

            $academicYearId =
                $student->academic_year_id;


            /*
            |--------------------------------------------------------------------------
            | All Payment Transactions
            |--------------------------------------------------------------------------
            */

            $payments =
                FeePayment::with([
                    'course',
                    'feeStructure.feeComponent',
                    'receiver',
                ])
                ->where(
                    'student_id',
                    $studentId
                )
                ->orderBy(
                    'payment_date',
                    'desc'
                )
                ->orderBy(
                    'id',
                    'desc'
                )
                ->get();


            /*
            |--------------------------------------------------------------------------
            | Total Successful Payments
            |--------------------------------------------------------------------------
            */

            $totalPaid =
                $payments
                    ->where(
                        'status',
                        'Success'
                    )
                    ->sum('amount');


            /*
            |--------------------------------------------------------------------------
            | Course Fee Structure
            |--------------------------------------------------------------------------
            |
            | The structure must match:
            |
            | Student Course
            | Student Academic Year
            | Course Fee Component
            |
            */

            $feeStructure = null;


            if (
                !empty($courseId) &&
                !empty($academicYearId)
            ) {

                $feeStructure =
                    FeeStructure::with([
                        'course',
                        'feeComponent',
                    ])
                    ->where(
                        'course_id',
                        $courseId
                    )
                    ->where(
                        'academic_year_id',
                        $academicYearId
                    )
                    ->where(
                        'status',
                        true
                    )
                    ->whereHas(
                        'feeComponent',
                        function ($query) {

                            $query->where(
                                'component_type',
                                'course'
                            );

                        }
                    )
                    ->latest('id')
                    ->first();

            }


            /*
            |--------------------------------------------------------------------------
            | Total Course Fee
            |--------------------------------------------------------------------------
            */

            $totalFee =
                $feeStructure
                    ? (float) $feeStructure->total_amount
                    : 0;


            /*
            |--------------------------------------------------------------------------
            | Waiver
            |--------------------------------------------------------------------------
            |
            | Fetch the student's approved waiver for this fee structure.
            |
            */

            $totalWaiver = StudentFeeWaiver::where('student_id', $studentId)
                ->where('fee_structure_id', $feeStructure->id ?? null)
                ->where('status', true)
                ->sum('waiver_amount');


            /*
            |--------------------------------------------------------------------------
            | Net Payable
            |--------------------------------------------------------------------------
            */

            $netPayable =
                max(
                    0,
                    $totalFee - $totalWaiver
                );


            /*
            |--------------------------------------------------------------------------
            | Due Amount
            |--------------------------------------------------------------------------
            */

            $dueAmount =
                max(
                    0,
                    $netPayable - $totalPaid
                );


            /*
            |--------------------------------------------------------------------------
            | Student Profile
            |--------------------------------------------------------------------------
            */

            $studentProfile = [

                'id' =>
                    $student->id,

                'student_code' =>
                    $student->student_code,

                'admission_no' =>
                    $student->admission_no,

                'roll_no' =>
                    $student->roll_no,

                'first_name' =>
                    $student->first_name,

                'middle_name' =>
                    $student->middle_name,

                'last_name' =>
                    $student->last_name,

                'full_name' =>
                    $student->full_name,

                'photo' =>
                    $student->photo,

                'course_id' =>
                    $student->course_id,

                'academic_year_id' =>
                    $student->academic_year_id,

                'class_id' =>
                    $student->class_id,

                'section_id' =>
                    $student->section_id,

                'hostel_required' =>
                    (bool) $student->hostel_required,

            ];


            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */

            return response()->json([

                'success' => true,

                'data' => [

                    /*
                    |--------------------------------------------------------------------------
                    | Student
                    |--------------------------------------------------------------------------
                    */

                    'student' =>
                        $studentProfile,


                    /*
                    |--------------------------------------------------------------------------
                    | Fee Structure
                    |--------------------------------------------------------------------------
                    */

                    'fee_structure' =>
                        $feeStructure,


                    /*
                    |--------------------------------------------------------------------------
                    | Fee Summary
                    |--------------------------------------------------------------------------
                    */

                    'summary' => [

                        'total_fee' =>
                            $totalFee,

                        'total_waiver' =>
                            $totalWaiver,

                        'net_payable' =>
                            $netPayable,

                        'total_paid' =>
                            (float) $totalPaid,

                        'due_amount' =>
                            $dueAmount,

                    ],


                    /*
                    |--------------------------------------------------------------------------
                    | Transactions
                    |--------------------------------------------------------------------------
                    */

                    'transactions' =>
                        $payments,

                ],

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to fetch student fee details.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Collect Fee Payment
    |--------------------------------------------------------------------------
    */


    public function store(Request $request)
    {
        try {

            /*
            |--------------------------------------------------------------------------
            | Validate
            |--------------------------------------------------------------------------
            |
            | course_id is intentionally NOT accepted from frontend.
            | It will be taken from students.course_id.
            |
            */

            $validated =
                $request->validate([

                    'student_id' =>
                        'required|integer|exists:students,id',

                    'fee_structure_id' =>
                        'required|integer|exists:fee_structures,id',

                    'payment_date' =>
                        'required|date',

                    'amount' =>
                        'required|numeric|min:0.01',

                    'payment_mode' =>
                        'required|string|max:30',

                    'transaction_reference' =>
                        'nullable|string|max:255',

                    'cheque_no' =>
                        'nullable|string|max:100',

                    'bank_name' =>
                        'nullable|string|max:255',

                    'remarks' =>
                        'nullable|string',

                ]);


            /*
            |--------------------------------------------------------------------------
            | Student
            |--------------------------------------------------------------------------
            */

            $student =
                Student::findOrFail(
                    $validated['student_id']
                );


            /*
            |--------------------------------------------------------------------------
            | Student Course
            |--------------------------------------------------------------------------
            */

            $courseId =
                $student->course_id;


            if (empty($courseId)) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Course is not assigned to this student.',

                ], 422);

            }


            /*
            |--------------------------------------------------------------------------
            | Student Academic Year
            |--------------------------------------------------------------------------
            */

            $academicYearId =
                $student->academic_year_id;


            /*
            |--------------------------------------------------------------------------
            | Fee Structure
            |--------------------------------------------------------------------------
            */

            $feeStructure =
                FeeStructure::with([
                    'feeComponent',
                ])
                ->findOrFail(
                    $validated['fee_structure_id']
                );


            /*
            |--------------------------------------------------------------------------
            | Validate Fee Structure
            |--------------------------------------------------------------------------
            |
            | The selected fee structure must belong to:
            |
            | Student Course
            | Student Academic Year
            |
            */

            if (
                (int) $feeStructure->course_id
                !==
                (int) $courseId
            ) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Selected fee structure does not belong to this student course.',

                ], 422);

            }


            if (
                (int) $feeStructure->academic_year_id
                !==
                (int) $academicYearId
            ) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Selected fee structure does not belong to this student academic year.',

                ], 422);

            }


            /*
            |--------------------------------------------------------------------------
            | Validate Component
            |--------------------------------------------------------------------------
            */

            if (
                !$feeStructure->feeComponent ||
                strtolower(
                    $feeStructure
                        ->feeComponent
                        ->component_type
                ) !== 'course'
            ) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Selected fee structure is not a course fee structure.',

                ], 422);

            }


            /*
            |--------------------------------------------------------------------------
            | Already Paid
            |--------------------------------------------------------------------------
            */

            $alreadyPaid =
                FeePayment::where(
                    'student_id',
                    $student->id
                )
                ->where(
                    'fee_structure_id',
                    $feeStructure->id
                )
                ->where(
                    'status',
                    'Success'
                )
                ->sum('amount');


            /*
            |--------------------------------------------------------------------------
            | Total Fee
            |--------------------------------------------------------------------------
            */

            $totalFee =
                (float)
                $feeStructure->total_amount;


            /*
            |--------------------------------------------------------------------------
            | Waiver
            |--------------------------------------------------------------------------
            |
            | Fetch the student's approved waiver for this fee structure.
            |
            */

            $totalWaiver = StudentFeeWaiver::where('student_id', $student->id)
                ->where('fee_structure_id', $feeStructure->id)
                ->where('status', true)
                ->sum('waiver_amount');


            /*
            |--------------------------------------------------------------------------
            | Remaining Due
            |--------------------------------------------------------------------------
            */

            $remainingDue =
                max(
                    0,
                    $totalFee
                    - $totalWaiver
                    - $alreadyPaid
                );


            /*
            |--------------------------------------------------------------------------
            | Payment Amount
            |--------------------------------------------------------------------------
            */

            $paymentAmount =
                (float)
                $validated['amount'];


            /*
            |--------------------------------------------------------------------------
            | Prevent Overpayment
            |--------------------------------------------------------------------------
            */

            if (
                $paymentAmount >
                $remainingDue
            ) {

                return response()->json([

                    'success' => false,

                    'message' =>
                        'Payment amount cannot be greater than the remaining due amount.',

                    'data' => [

                        'total_fee' =>
                            $totalFee,

                        'total_waiver' =>
                            $totalWaiver,

                        'already_paid' =>
                            (float) $alreadyPaid,

                        'remaining_due' =>
                            $remainingDue,

                    ],

                ], 422);

            }


            /*
            |--------------------------------------------------------------------------
            | Generate Receipt Number
            |--------------------------------------------------------------------------
            */

            $receiptNo =
                $this->generateReceiptNumber();


            /*
            |--------------------------------------------------------------------------
            | Create Payment
            |--------------------------------------------------------------------------
            */

            $payment =
                FeePayment::create([

                    'student_id' =>
                        $student->id,

                    /*
                    |--------------------------------------------------------------------------
                    | Course comes from Student
                    |--------------------------------------------------------------------------
                    */

                    'course_id' =>
                        $courseId,

                    'fee_structure_id' =>
                        $feeStructure->id,

                    'receipt_no' =>
                        $receiptNo,

                    'payment_date' =>
                        $validated['payment_date'],

                    'amount' =>
                        $paymentAmount,

                    'payment_mode' =>
                        $validated['payment_mode'],

                    'transaction_reference' =>
                        $validated[
                            'transaction_reference'
                        ] ?? null,

                    'cheque_no' =>
                        $validated[
                            'cheque_no'
                        ] ?? null,

                    'bank_name' =>
                        $validated[
                            'bank_name'
                        ] ?? null,

                    'remarks' =>
                        $validated[
                            'remarks'
                        ] ?? null,

                    'status' =>
                        'Success',

                    'received_by' =>
                        Auth::id(),

                ]);


            /*
            |--------------------------------------------------------------------------
            | Updated Summary
            |--------------------------------------------------------------------------
            */

            $newTotalPaid =
                (float) $alreadyPaid
                + $paymentAmount;


            $newDueAmount =
                max(
                    0,
                    $totalFee
                    - $totalWaiver
                    - $newTotalPaid
                );


            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */

            return response()->json([

                'success' => true,

                'message' =>
                    'Fee payment collected successfully.',

                'data' => [

                    'payment' =>
                        $payment->load([
                            'student',
                            'course',
                            'feeStructure',
                        ]),

                    'summary' => [

                        'total_fee' =>
                            $totalFee,

                        'total_waiver' =>
                            $totalWaiver,

                        'net_payable' =>
                            max(
                                0,
                                $totalFee
                                - $totalWaiver
                            ),

                        'total_paid' =>
                            $newTotalPaid,

                        'due_amount' =>
                            $newDueAmount,

                    ],

                ],

            ], 201);

        }
        catch (
            \Illuminate\Validation\ValidationException $e
        ) {

            throw $e;

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Unable to collect fee payment.',

                'error' =>
                    $e->getMessage(),

            ], 500);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | My Fee Details - Logged In Student
    |--------------------------------------------------------------------------
    */

    public function myFeeDetails(Request $request)
    {
        try {

            /*
            |--------------------------------------------------------------------------
            | Logged In User
            |--------------------------------------------------------------------------
            */

            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }


            /*
            |--------------------------------------------------------------------------
            | Find Student
            |--------------------------------------------------------------------------
            */

            $student = Student::where('user_id', $user->id)
                ->where('status', 1)
                ->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student record not found for this user.',
                ], 404);
            }


            /*
            |--------------------------------------------------------------------------
            | Student Course & Academic Year
            |--------------------------------------------------------------------------
            */

            $courseId = $student->course_id;
            $academicYearId = $student->academic_year_id;


            if (empty($courseId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course is not assigned to this student.',
                ], 422);
            }


            if (empty($academicYearId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Academic year is not assigned to this student.',
                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | Get Applicable Fee Structure
            |--------------------------------------------------------------------------
            |
            | Match:
            | - Student Course
            | - Student Academic Year
            | - Active Fee Structure
            | - Course Fee Component
            |
            */

            $feeStructure = FeeStructure::with([
                'course',
                'feeComponent',
            ])
            ->where('course_id', $courseId)
            ->where('academic_year_id', $academicYearId)
            ->where('status', true)
            ->whereHas('feeComponent', function ($query) {
                $query->where('component_type', 'course');
            })
            ->latest('id')
            ->first();


            if (!$feeStructure) {

                return response()->json([
                    'success' => true,
                    'message' => 'No fee structure found for this student.',
                    'data' => [
                        'student' => [
                            'id' => $student->id,
                            'student_code' => $student->student_code,
                            'admission_no' => $student->admission_no,
                            'full_name' => $student->full_name,
                            'course_id' => $student->course_id,
                            'academic_year_id' => $student->academic_year_id,
                            'class_id' => $student->class_id,
                            'section_id' => $student->section_id,
                        ],

                        'fee_structure' => null,

                        'fee_items' => [],

                        'summary' => [
                            'total_fee' => 0,
                            'total_waiver' => 0,
                            'net_payable' => 0,
                            'total_paid' => 0,
                            'due_amount' => 0,
                        ],

                        'transactions' => [],
                    ],
                ], 200);
            }


            /*
            |--------------------------------------------------------------------------
            | Fee Structure Items
            |--------------------------------------------------------------------------
            |
            | Example:
            | Tuition Fee
            | Hostel Fee
            | Transport Fee
            | Admission Fee
            | etc.
            |
            */

            $feeItems = DB::table('fee_structure_items')
                ->where('fee_structure_id', $feeStructure->id)
                ->orderBy('order_number', 'asc')
                ->orderBy('id', 'asc')
                ->get([
                    'id',
                    'fee_structure_id',
                    'fee_head',
                    'description',
                    'amount',
                    'order_number',
                ]);


            /*
            |--------------------------------------------------------------------------
            | Total Fee
            |--------------------------------------------------------------------------
            */

            $totalFee = (float) $feeStructure->total_amount;


            /*
            |--------------------------------------------------------------------------
            | Student Approved Waiver
            |--------------------------------------------------------------------------
            */

            $totalWaiver = (float) StudentFeeWaiver::where(
                'student_id',
                $student->id
            )
            ->where(
                'fee_structure_id',
                $feeStructure->id
            )
            ->where('status', true)
            ->sum('waiver_amount');


            /*
            |--------------------------------------------------------------------------
            | Successful Payments
            |--------------------------------------------------------------------------
            */

            $payments = FeePayment::with([
                'course',
                'feeStructure.feeComponent',
                'receiver',
            ])
            ->where('student_id', $student->id)
            ->where('status', 'Success')
            ->orderBy('payment_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();


            /*
            |--------------------------------------------------------------------------
            | Total Paid
            |--------------------------------------------------------------------------
            */

            $totalPaid = (float) $payments->sum('amount');


            /*
            |--------------------------------------------------------------------------
            | Net Payable
            |--------------------------------------------------------------------------
            */

            $netPayable = max(
                0,
                $totalFee - $totalWaiver
            );


            /*
            |--------------------------------------------------------------------------
            | Due Amount
            |--------------------------------------------------------------------------
            */

            $dueAmount = max(
                0,
                $netPayable - $totalPaid
            );


            /*
            |--------------------------------------------------------------------------
            | Student Profile
            |--------------------------------------------------------------------------
            */

            $studentProfile = [
                'id' => $student->id,
                'student_code' => $student->student_code,
                'admission_no' => $student->admission_no,
                'roll_no' => $student->roll_no,

                'first_name' => $student->first_name,
                'middle_name' => $student->middle_name,
                'last_name' => $student->last_name,
                'full_name' => $student->full_name,

                'photo' => $student->photo,

                'course_id' => $student->course_id,
                'academic_year_id' => $student->academic_year_id,
                'class_id' => $student->class_id,
                'section_id' => $student->section_id,

                'hostel_required' => (bool) $student->hostel_required,
            ];


            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */

            return response()->json([

                'success' => true,

                'message' => 'Student fee details loaded successfully.',

                'data' => [

                    /*
                    |--------------------------------------------------------------------------
                    | Student
                    |--------------------------------------------------------------------------
                    */

                    'student' => $studentProfile,


                    /*
                    |--------------------------------------------------------------------------
                    | Fee Structure
                    |--------------------------------------------------------------------------
                    */

                    'fee_structure' => $feeStructure,


                    /*
                    |--------------------------------------------------------------------------
                    | Individual Fee Heads
                    |--------------------------------------------------------------------------
                    */

                    'fee_items' => $feeItems,


                    /*
                    |--------------------------------------------------------------------------
                    | Fee Summary
                    |--------------------------------------------------------------------------
                    */

                    'summary' => [

                        'total_fee' => $totalFee,

                        'total_waiver' => $totalWaiver,

                        'net_payable' => $netPayable,

                        'total_paid' => $totalPaid,

                        'due_amount' => $dueAmount,

                    ],


                    /*
                    |--------------------------------------------------------------------------
                    | Payment Transactions
                    |--------------------------------------------------------------------------
                    */

                    'transactions' => $payments,

                ],

            ], 200);


        } catch (\Exception $e) {

            \Log::error('Student Mobile Fee Details Error', [
                'user_id' => optional($request->user())->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch student fee details.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Show Single Payment
    |--------------------------------------------------------------------------
    */


    public function show($id)
    {
        try {

            $payment =
                FeePayment::with([
                    'student',
                    'course',
                    'feeStructure.feeComponent',
                    'receiver',
                ])
                ->findOrFail($id);


            return response()->json([

                'success' => true,

                'data' =>
                    $payment,

            ], 200);

        }
        catch (\Exception $e) {

            return response()->json([

                'success' => false,

                'message' =>
                    'Payment not found.',

                'error' =>
                    $e->getMessage(),

            ], 404);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Receipt Number
    |--------------------------------------------------------------------------
    */


    private function generateReceiptNumber()
    {
        $prefix =
            'FEE-' .
            date('Ymd') .
            '-';


        $lastPayment =
            FeePayment::where(
                'receipt_no',
                'like',
                $prefix . '%'
            )
            ->latest('id')
            ->first();


        if ($lastPayment) {

            $lastNumber =
                (int) substr(
                    $lastPayment->receipt_no,
                    -4
                );

            $nextNumber =
                $lastNumber + 1;

        }
        else {

            $nextNumber = 1;

        }


        return $prefix .
            str_pad(
                $nextNumber,
                4,
                '0',
                STR_PAD_LEFT
            );
    }
}