<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;

class EmployeeController extends Controller
{
    /**
     * Display all active employees.
     */
    public function index()
    {
        $employees = Employee::with([
                'branch:id,branch_name',
                'department:id,department_name',
                'designation:id,designation_name'
            ])
            ->where('active', 1)
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $employees
        ]);
    }

    /**
     * Display inactive employees.
     */
    public function inactive()
    {
        $employees = Employee::with([
                'branch:id,branch_name',
                'department:id,department_name',
                'designation:id,designation_name'
            ])
            ->where('active', 0)
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $employees
        ]);
    }

    /**
     * Employee list for Reporting Manager / Buddy dropdown.
     */
    public function list()
    {
        $employees = Employee::where('active', 1)
            ->select('id', 'first_name', 'middle_name', 'last_name')
            ->orderBy('first_name')
            ->get()
            ->map(function ($employee) {

                $employee->full_name = trim(
                    $employee->first_name . ' ' .
                    $employee->middle_name . ' ' .
                    $employee->last_name
                );

                return $employee;
            });

        return response()->json($employees);
    }

    /**
     * Check Aadhaar Number.
     */
    public function checkAadhaar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'aadhaar_number' => 'required|digits:12',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);

        }

        $employee = Employee::where(
            'aadhaar_number',
            $request->aadhaar_number
        )->first();

        if ($employee) {

            return response()->json([
                'status' => true,
                'exists' => true,
                'employee' => $employee
            ]);

        }

        return response()->json([
            'status' => true,
            'exists' => false
        ]);
    }

    /**
     * Store Employee.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',

            // Basic & Personal
            'religion' => 'nullable|string|max:255',
            'caste' => 'nullable|string|max:255',
            'sub_caste' => 'nullable|string|max:255',

            // Bank, ID & Other Details
            'aadhaar_number' => 'required|digits:12',
            'pan_number' => 'required|string|max:20',

            'branch_id' => 'nullable|exists:branches,id',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',

            // Qualification & Education
            'qualification' => 'nullable|string|max:255',
            'teaching_subject' => 'nullable|string|max:255',

            'board_10th' => 'nullable|string|max:255',
            'year_pass_10th' => 'nullable|string|max:20',
            'percentage_10th' => 'nullable|numeric|min:0|max:100',

            'board_12th' => 'nullable|string|max:255',
            'year_pass_12th' => 'nullable|string|max:20',
            'percentage_12th' => 'nullable|numeric|min:0|max:100',

            'board_graduate' => 'nullable|string|max:255',
            'year_pass_graduate' => 'nullable|string|max:20',
            'percentage_graduate' => 'nullable|numeric|min:0|max:100',

            'board_post_graduate' => 'nullable|string|max:255',
            'year_pass_post_graduate' => 'nullable|string|max:20',
            'percentage_post_graduate' => 'nullable|numeric|min:0|max:100',

            // Experience
            'experience' => 'nullable|string|max:255',
            'last_salary' => 'nullable|numeric|min:0',

            // Emergency Contact Details
            'emergency_contact_1_name' => 'nullable|string|max:100',
            'emergency_contact_1_relation' => 'nullable|string|max:50',
            'emergency_contact_1_place' => 'nullable|string|max:150',
            'emergency_contact_1_phone' => 'nullable|string|max:20',

            'emergency_contact_2_name' => 'nullable|string|max:100',
            'emergency_contact_2_relation' => 'nullable|string|max:50',
            'emergency_contact_2_place' => 'nullable|string|max:150',
            'emergency_contact_2_phone' => 'nullable|string|max:20',

            // Documents
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'pan_card_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'aadhaar_card_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'signature' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'bank_details_document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'driving_license_document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'marksheet_10th' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'marksheet_12th' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'graduation_certificate' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'post_graduation_certificate' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'policy_document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'other_documents' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

        ]);

        DB::beginTransaction();

        try {

            // Generate Employee Code in format "SSB 95000", "SSB 95001", etc.
            $lastEmployee = Employee::where('employee_code', 'LIKE', 'SSB %')
                ->orderBy('id', 'desc')
                ->first();

            if ($lastEmployee && preg_match('/^SSB\s+(\d+)$/', $lastEmployee->employee_code, $matches)) {
                $nextNumber = (int) $matches[1] + 1;
            } else {
                $nextNumber = 95000;
            }

            $employeeCode = 'SSB ' . $nextNumber;

            $nullable = function ($value) {
                return $value === '' || $value === null ? null : $value;
            };

            $data = [

                // Basic
                'employee_code' => $employeeCode,
                'first_name' => $request->first_name,
                'middle_name' => $nullable($request->middle_name),
                'last_name' => $nullable($request->last_name),
                'full_name' => trim($request->first_name.' '.$request->middle_name.' '.$request->last_name),

                'gender' => $nullable($request->gender),
                'dob' => $nullable($request->dob),
                'marital_status' => $nullable($request->marital_status),

                'religion' => $nullable($request->religion),
                'caste' => $nullable($request->caste),
                'sub_caste' => $nullable($request->sub_caste),

                'email' => $nullable($request->email),
                'phone_number' => $nullable($request->mobile),
                'whatsapp_number' => $nullable($request->whatsapp_number),

                // Emergency Contact Details
                'emergency_contact_1_name' => $nullable($request->emergency_contact_1_name),
                'emergency_contact_1_relation' => $nullable($request->emergency_contact_1_relation),
                'emergency_contact_1_place' => $nullable($request->emergency_contact_1_place),
                'emergency_contact_1_phone' => $nullable($request->emergency_contact_1_phone),

                'emergency_contact_2_name' => $nullable($request->emergency_contact_2_name),
                'emergency_contact_2_relation' => $nullable($request->emergency_contact_2_relation),
                'emergency_contact_2_place' => $nullable($request->emergency_contact_2_place),
                'emergency_contact_2_phone' => $nullable($request->emergency_contact_2_phone),

                'aadhaar_number' => $nullable($request->aadhaar_number),
                'pan_number' => $nullable($request->pan_number),

                'present_address' => $nullable($request->present_address),
                'permanent_address' => $nullable($request->permanent_address),



                // Employment
                'branch_id' => $nullable($request->branch_id),
                'department_id' => $nullable($request->department_id),
                'designation_id' => $nullable($request->designation_id),

                'employee_type' => $nullable($request->employee_type),

                'joining_date' => $nullable($request->joining_date),
                'last_working_date' => $nullable($request->last_working_date),

                'shift' => $nullable($request->shift),
                'start_time' => $nullable($request->start_time),
                'end_time' => $nullable($request->end_time),

                'reporting_id' => $nullable($request->reporting_id),
                'buddy_id' => $nullable($request->buddy_id),

                // Salary
                'salary_scale' => $nullable($request->salary),

                // Bank
                'bank_name' => $nullable($request->bank_name),
                'branch_name' => $nullable($request->branch_name),
                'bank_account_number' => $nullable($request->account_number),
                'bank_account_name' => $nullable($request->bank_account_name),
                'ifsc_code' => $nullable($request->ifsc_code),

                // Qualification & Education
                'qualification' => $nullable($request->qualification),
                'teaching_subject' => $nullable($request->teaching_subject),

                // Std 10
                'board_10th' => $nullable($request->board_10th),
                'year_pass_10th' => $nullable($request->year_pass_10th),
                'percentage_10th' => $nullable($request->percentage_10th),

                // Std 12
                'board_12th' => $nullable($request->board_12th),
                'year_pass_12th' => $nullable($request->year_pass_12th),
                'percentage_12th' => $nullable($request->percentage_12th),

                // Graduate
                'board_graduate' => $nullable($request->board_graduate),
                'year_pass_graduate' => $nullable($request->year_pass_graduate),
                'percentage_graduate' => $nullable($request->percentage_graduate),

                // Post Graduate
                'board_post_graduate' => $nullable($request->board_post_graduate),
                'year_pass_post_graduate' => $nullable($request->year_pass_post_graduate),
                'percentage_post_graduate' => $nullable($request->percentage_post_graduate),

                // Experience
                'experience_duration' => $nullable($request->experience),

                // Last Salary
                'experience_last_salary' => $nullable($request->last_salary),

                // Others
                'reference' => $nullable($request->reference),
                'username' => $employeeCode,
                'role_id' => $nullable($request->role_id),

                'active' => $request->active ?? 1,
            ];


            if ($request->hasFile('profile_photo')) {

                $data['profile_photo'] = $request
                    ->file('profile_photo')
                    ->store('configuration/employees/profile', 'public');

            }

            if ($request->hasFile('pan_card_photo')) {

                $data['pan_card_photo'] = $request
                    ->file('pan_card_photo')
                    ->store('configuration/employees/pan', 'public');

            }

            if ($request->hasFile('aadhaar_card_photo')) {

                $data['aadhaar_card_photo'] = $request
                    ->file('aadhaar_card_photo')
                    ->store('configuration/employees/aadhaar', 'public');

            }

            if ($request->hasFile('signature')) {

                $data['signature'] = $request
                    ->file('signature')
                    ->store('configuration/employees/signature', 'public');

            }

            // Bank Details Document
            if ($request->hasFile('bank_details_document')) {

                $data['bank_details_document'] = $request
                    ->file('bank_details_document')
                    ->store('configuration/employees/bank', 'public');

            }

            // Driving License
            if ($request->hasFile('driving_license_document')) {

                $data['driving_license_document'] = $request
                    ->file('driving_license_document')
                    ->store('configuration/employees/driving-license', 'public');

            }

            // 10th Marksheet
            if ($request->hasFile('marksheet_10th')) {

                $data['marksheet_10th'] = $request
                    ->file('marksheet_10th')
                    ->store('configuration/employees/education/10th', 'public');

            }

            // 12th Marksheet
            if ($request->hasFile('marksheet_12th')) {

                $data['marksheet_12th'] = $request
                    ->file('marksheet_12th')
                    ->store('configuration/employees/education/12th', 'public');

            }

            // Graduation Certificate
            if ($request->hasFile('graduation_certificate')) {

                $data['graduation_certificate'] = $request
                    ->file('graduation_certificate')
                    ->store('configuration/employees/education/graduation', 'public');

            }

            // Post Graduation Certificate
            if ($request->hasFile('post_graduation_certificate')) {

                $data['post_graduation_certificate'] = $request
                    ->file('post_graduation_certificate')
                    ->store('configuration/employees/education/post-graduation', 'public');

            }

            // Policy Document
            if ($request->hasFile('policy_document')) {

                $data['policy_document'] = $request
                    ->file('policy_document')
                    ->store('configuration/employees/policy', 'public');

            }

            // Other Documents
            if ($request->hasFile('other_documents')) {

                $data['other_documents'] = $request
                    ->file('other_documents')
                    ->store('configuration/employees/other', 'public');

            }

            $employee = Employee::create($data);

            /*
            |--------------------------------------------------------------------------
            | Create User record for Employee login (if role_id is provided)
            |--------------------------------------------------------------------------
            */

            if (!empty($request->role_id) && !empty($request->email)) {

                $userPassword = $request->password
                    ? $request->password
                    : ($request->dob ? date('dmY', strtotime($request->dob)) : 'Employee@123');

                $user = User::create([
                    'employee_id'   => $employee->id,
                    'role_id'       => $request->role_id,
                    'name'          => trim($request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name),
                    'email'         => $request->email,
                    'mobile'        => $nullable($request->mobile),
                    'password'      => Hash::make($userPassword),
                    'profile_photo' => $data['profile_photo'] ?? null,
                    'status'        => ($request->active ?? 1) ? 1 : 0,
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Employee created successfully.',
                'employee' => $employee
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);

        }
    }

    public function show($id)
    {
        $employee = Employee::with([
                'branch:id,branch_name',
                'department:id,department_name',
                'designation:id,designation_name'
            ])->find($id);

        if (!$employee) {

            return response()->json([
                'status' => false,
                'message' => 'Employee not found.'
            ], 404);

        }

        return response()->json([
            'status' => true,
            'employee' => $employee
        ]);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => false,
                'message' => 'Employee not found.'
            ], 404);
        }

        $request->validate([
            'first_name' => 'required|string|max:255',

            // Basic & Personal
            'religion' => 'nullable|string|max:255',
            'caste' => 'nullable|string|max:255',
            'sub_caste' => 'nullable|string|max:255',

            // Bank, ID & Other Details
            'aadhaar_number' => 'required|digits:12',
            'pan_number' => 'required|string|max:20',

            // Qualification & Education
            'qualification' => 'nullable|string|max:255',
            'teaching_subject' => 'nullable|string|max:255',

            'board_10th' => 'nullable|string|max:255',
            'year_pass_10th' => 'nullable|string|max:20',
            'percentage_10th' => 'nullable|numeric|min:0|max:100',

            'board_12th' => 'nullable|string|max:255',
            'year_pass_12th' => 'nullable|string|max:20',
            'percentage_12th' => 'nullable|numeric|min:0|max:100',

            'board_graduate' => 'nullable|string|max:255',
            'year_pass_graduate' => 'nullable|string|max:20',
            'percentage_graduate' => 'nullable|numeric|min:0|max:100',

            'board_post_graduate' => 'nullable|string|max:255',
            'year_pass_post_graduate' => 'nullable|string|max:20',
            'percentage_post_graduate' => 'nullable|numeric|min:0|max:100',

            // Experience
            'experience' => 'nullable|string|max:255',
            'last_salary' => 'nullable|numeric|min:0',

            // Emergency Contact Details
            'emergency_contact_1_name' => 'nullable|string|max:100',
            'emergency_contact_1_relation' => 'nullable|string|max:50',
            'emergency_contact_1_place' => 'nullable|string|max:150',
            'emergency_contact_1_phone' => 'nullable|string|max:20',

            'emergency_contact_2_name' => 'nullable|string|max:100',
            'emergency_contact_2_relation' => 'nullable|string|max:50',
            'emergency_contact_2_place' => 'nullable|string|max:150',
            'emergency_contact_2_phone' => 'nullable|string|max:20',

            'branch_id' => 'nullable|exists:branches,id',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',

            // Documents
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'pan_card_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'aadhaar_card_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'signature' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'bank_details_document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'driving_license_document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'marksheet_10th' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'marksheet_12th' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'graduation_certificate' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'post_graduation_certificate' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',

            'policy_document' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'other_documents' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
        ]);

        DB::beginTransaction();

        try {

            $nullable = function ($value) {
                return $value === '' || $value === null ? null : $value;
            };

            $data = [

                // Basic & Personal
                'employee_code' => $request->employee_code,

                'first_name' => $request->first_name,
                'middle_name' => $nullable($request->middle_name),
                'last_name' => $nullable($request->last_name),

                'full_name' => trim(
                    $request->first_name . ' ' .
                    $request->middle_name . ' ' .
                    $request->last_name
                ),

                'gender' => $nullable($request->gender),
                'dob' => $nullable($request->dob),
                'marital_status' => $nullable($request->marital_status),

                'religion' => $nullable($request->religion),
                'caste' => $nullable($request->caste),
                'sub_caste' => $nullable($request->sub_caste),

                'email' => $nullable($request->email),
                'phone_number' => $nullable($request->mobile),
                'whatsapp_number' => $nullable($request->whatsapp_number),
                

                // Emergency Contact Details
                'emergency_contact_1_name' => $nullable($request->emergency_contact_1_name),
                'emergency_contact_1_relation' => $nullable($request->emergency_contact_1_relation),
                'emergency_contact_1_place' => $nullable($request->emergency_contact_1_place),
                'emergency_contact_1_phone' => $nullable($request->emergency_contact_1_phone),

                'emergency_contact_2_name' => $nullable($request->emergency_contact_2_name),
                'emergency_contact_2_relation' => $nullable($request->emergency_contact_2_relation),
                'emergency_contact_2_place' => $nullable($request->emergency_contact_2_place),
                'emergency_contact_2_phone' => $nullable($request->emergency_contact_2_phone),

                'aadhaar_number' => $nullable($request->aadhaar_number),
                'pan_number' => $nullable($request->pan_number),

                'present_address' => $nullable($request->present_address),
                'permanent_address' => $nullable($request->permanent_address),


                // Employment
                'branch_id' => $nullable($request->branch_id),
                'department_id' => $nullable($request->department_id),
                'designation_id' => $nullable($request->designation_id),

                'employee_type' => $nullable($request->employee_type),

                'joining_date' => $nullable($request->joining_date),
                'last_working_date' => $nullable($request->last_working_date),

                'shift' => $nullable($request->shift),
                'start_time' => $nullable($request->start_time),
                'end_time' => $nullable($request->end_time),

                'reporting_id' => $nullable($request->reporting_id),
                'buddy_id' => $nullable($request->buddy_id),


                // Salary
                'salary_scale' => $nullable($request->salary),


                // Bank, ID & Other Details
                'bank_name' => $nullable($request->bank_name),
                'branch_name' => $nullable($request->branch_name),
                'bank_account_name' => $nullable($request->bank_account_name),
                'bank_account_number' => $nullable($request->account_number),
                'ifsc_code' => $nullable($request->ifsc_code),

                'reference' => $nullable($request->reference),


                // Qualification & Education

                'qualification' => $nullable($request->qualification),
                'teaching_subject' => $nullable($request->teaching_subject),

                // Std 10
                'board_10th' => $nullable($request->board_10th),
                'year_pass_10th' => $nullable($request->year_pass_10th),
                'percentage_10th' => $nullable($request->percentage_10th),

                // Std 12
                'board_12th' => $nullable($request->board_12th),
                'year_pass_12th' => $nullable($request->year_pass_12th),
                'percentage_12th' => $nullable($request->percentage_12th),

                // Graduate
                'board_graduate' => $nullable($request->board_graduate),
                'year_pass_graduate' => $nullable($request->year_pass_graduate),
                'percentage_graduate' => $nullable($request->percentage_graduate),

                // Post Graduate
                'board_post_graduate' => $nullable($request->board_post_graduate),
                'year_pass_post_graduate' => $nullable($request->year_pass_post_graduate),
                'percentage_post_graduate' => $nullable($request->percentage_post_graduate),

                // Experience
                'experience_duration' => $nullable($request->experience),

                // Last Salary
                'experience_last_salary' => $nullable($request->last_salary),


                // Login / Others
                'username' => $request->employee_code,
                'role_id' => $nullable($request->role_id),

                'active' => $request->active ?? 1,
            ];


            // Profile Photo
            if ($request->hasFile('profile_photo')) {

                if ($employee->profile_photo) {
                    Storage::disk('public')->delete($employee->profile_photo);
                }

                $data['profile_photo'] = $request
                    ->file('profile_photo')
                    ->store('configuration/employees/profile', 'public');
            }


            // PAN Card
            if ($request->hasFile('pan_card_photo')) {

                if ($employee->pan_card_photo) {
                    Storage::disk('public')->delete($employee->pan_card_photo);
                }

                $data['pan_card_photo'] = $request
                    ->file('pan_card_photo')
                    ->store('configuration/employees/pan', 'public');
            }


            // Aadhaar Card
            if ($request->hasFile('aadhaar_card_photo')) {

                if ($employee->aadhaar_card_photo) {
                    Storage::disk('public')->delete($employee->aadhaar_card_photo);
                }

                $data['aadhaar_card_photo'] = $request
                    ->file('aadhaar_card_photo')
                    ->store('configuration/employees/aadhaar', 'public');
            }


            // Signature
            if ($request->hasFile('signature')) {

                if ($employee->signature) {
                    Storage::disk('public')->delete($employee->signature);
                }

                $data['signature'] = $request
                    ->file('signature')
                    ->store('configuration/employees/signature', 'public');
            }


            $employee->update($data);

            /*
            |--------------------------------------------------------------------------
            | Sync / Create User record for Employee login
            |--------------------------------------------------------------------------
            */

            if (!empty($request->role_id) && !empty($request->email)) {

                $userData = [
                    'role_id'       => $request->role_id,
                    'name'          => trim($request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name),
                    'email'         => $request->email,
                    'mobile'        => $nullable($request->mobile),
                    'profile_photo' => $data['profile_photo'] ?? ($employee->profile_photo ?? null),
                    'status'        => ($request->active ?? 1) ? 1 : 0,
                ];

                if (!empty($request->password)) {
                    $userData['password'] = Hash::make($request->password);
                }

                if ($employee->user) {
                    $employee->user->update($userData);
                } else {
                    if (empty($request->password)) {
                        $defaultPass = $request->dob
                            ? date('dmY', strtotime($request->dob))
                            : 'Employee@123';
                        $userData['password'] = Hash::make($defaultPass);
                    }
                    $userData['employee_id'] = $employee->id;
                    User::create($userData);
                }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Employee updated successfully.',
                'employee' => $employee
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
     * Soft Delete Employee.
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {

            return response()->json([
                'status' => false,
                'message' => 'Employee not found.'
            ], 404);

        }

        DB::beginTransaction();

        try {

            $employee->update([
                'active' => 0
            ]);

            if ($employee->user) {
                $employee->user->update([
                    'status' => 0
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Employee moved to inactive successfully.'
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
     * Restore Employee.
     */
    public function restore($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {

            return response()->json([
                'status' => false,
                'message' => 'Employee not found.'
            ], 404);

        }

        DB::beginTransaction();

        try {

            $employee->update([
                'active' => 1
            ]);

            if ($employee->user) {
                $employee->user->update([
                    'status' => 1
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Employee restored successfully.'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);

        }
    }
}