<?php

namespace App\Http\Controllers\Api\StudentManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use App\Models\Student;
use App\Models\User;
use App\Models\Role;
use App\Models\ParentModel;
use App\Models\StudentParent;
use App\Models\StudentDocument;
use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Section;
use App\Models\Course;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
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
    | Upload Student Documents
    |--------------------------------------------------------------------------
    */

    private function uploadDocument($file, $folder)
    {
        if (!$file) {
            return null;
        }

        return $file->store($folder, 'public');
    }

    /*
    |--------------------------------------------------------------------------
    | Common Validation Rules
    |--------------------------------------------------------------------------
    */

    private function validationRules()
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Academic
            |--------------------------------------------------------------------------
            */

            'course_id' => 'required|exists:courses,id',

            'academic_year_id' => 'required|exists:academic_years,id',

            'class_id' => 'required|exists:classes,id',

            'section_id' => 'nullable|exists:sections,id',

            'admission_date' => 'required|date',

            'admission_type' => 'required',

            /*
            |--------------------------------------------------------------------------
            | Student
            |--------------------------------------------------------------------------
            */

            'first_name' => 'required|max:100',

            'middle_name' => 'nullable|max:100',

            'last_name' => 'required|max:100',

            'gender' => 'required',

            'dob' => 'required|date',

            'email' => 'required|email|max:150|unique:students,email|unique:users,email',

            'mobile' => 'nullable|max:20',

            'password' => 'nullable|min:6|max:100',

            'blood_group' => 'nullable',

            'category' => 'nullable',

            'caste' => 'nullable',

            'sub_caste' => 'nullable',

            'religion' => 'nullable',

            'nationality' => 'nullable',

            'mother_tongue' => 'nullable',

            'birth_place' => 'nullable',

            'house' => 'nullable',

            /*
            |--------------------------------------------------------------------------
            | IDs
            |--------------------------------------------------------------------------
            */

            'aadhaar_number' => 'nullable|unique:students,aadhaar_number',

            'apaar_id' => 'nullable|unique:students,apaar_id',

            'pen_number' => 'nullable|unique:students,pen_number',

            'birth_certificate_no' => 'nullable',

            /*
            |--------------------------------------------------------------------------
            | Parent
            |--------------------------------------------------------------------------
            */

            'father_name' => 'required',

            'father_mobile' => 'required',

            'mother_name' => 'nullable',

            /*
            |--------------------------------------------------------------------------
            | Photo
            |--------------------------------------------------------------------------
            */

            'photo' => 'nullable|image|max:2048',

        ];
    }
    /*
    |--------------------------------------------------------------------------
    | Display Students
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $students = Student::with([
            'academicYear',
            'class',
            'section',
            'parents',
            'documents',
            'user'
        ])
        ->where('status', 1)
        ->latest()
        ->get();

        return response()->json([

            'success' => true,

            'data' => $students

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Store Student
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
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

            /*
            |--------------------------------------------------------------------------
            | Upload Student Photo
            |--------------------------------------------------------------------------
            */

            $photo = null;

            if ($request->hasFile('photo')) {

                $photo = $this->uploadDocument(

                    $request->file('photo'),

                    'students/profile'

                );

            }

            /*
            |--------------------------------------------------------------------------
            | Check Existing Parent
            |--------------------------------------------------------------------------
            */

            $parent = ParentModel::where(

                    'father_mobile',
                    $request->father_mobile

                )
                ->where(

                    'father_name',
                    $request->father_name

                )
                ->first();

            /*
            |--------------------------------------------------------------------------
            | Create Parent
            |--------------------------------------------------------------------------
            */

            if (!$parent) {

                $parent = ParentModel::create([

                    'father_name'       => $request->father_name,
                    'father_mobile'     => $request->father_mobile,
                    'father_email'      => $request->father_email,
                    'father_occupation' => $request->father_occupation,
                    'father_income'     => $request->father_income,

                    'mother_name'       => $request->mother_name,
                    'mother_mobile'     => $request->mother_mobile,
                    'mother_email'      => $request->mother_email,
                    'mother_occupation' => $request->mother_occupation,
                    'mother_income'     => $request->mother_income,

                    'guardian_name'     => $request->guardian_name,
                    'guardian_relation' => $request->guardian_relation,
                    'guardian_mobile'   => $request->guardian_mobile,

                    'address'           => $request->address,
                    'city'              => $request->city,
                    'state'             => $request->state,
                    'country'           => $request->country,
                    'pincode'           => $request->pincode,

                    'status'            => 1,

                    'created_by'        => auth()->id(),

                    'updated_by'        => auth()->id(),

                ]);

            }

            /*
            |--------------------------------------------------------------------------
            | Create Student
            |--------------------------------------------------------------------------
            */

            $student = Student::create([

                'student_code'        => $this->generateStudentCode(),

                'admission_no'        => $this->generateAdmissionNumber(),
                    
                'roll_no'             => $request->roll_no,

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

                'email'               => $request->email,

                'mobile'              => $request->mobile,

                'blood_group'         => $request->blood_group,

                'category'            => $request->category,

                'caste'               => $request->caste,

                'sub_caste'           => $request->sub_caste,

                'religion'            => $request->religion,

                'nationality'         => $request->nationality,

                'mother_tongue'       => $request->mother_tongue,

                'birth_place'         => $request->birth_place,

                'house'               => $request->house,

                'aadhaar_number'      => $request->aadhaar_number,

                'apaar_id'            => $request->apaar_id,

                'pen_number'          => $request->pen_number,

                'birth_certificate_no'=> $request->birth_certificate_no,

                'previous_school'     => $request->previous_school,

                'transport_required'  => $request->transport_required ?? 0,

                'hostel_required'     => $request->hostel_required ?? 0,

                'photo'               => $photo,

                'remarks'             => $request->remarks,

                'status'              => 1,

                'created_by'          => auth()->id(),

                'updated_by'          => auth()->id(),

            ]);

            /*
            |--------------------------------------------------------------------------
            | Student Parent Mapping
            |--------------------------------------------------------------------------
            */

            StudentParent::create([

                'student_id' => $student->id,

                'parent_id'  => $parent->id,

            ]);

            /*
            |--------------------------------------------------------------------------
            | Handle Student Documents
            |--------------------------------------------------------------------------
            */

            if ($request->has('documents') && is_array($request->documents)) {
                foreach ($request->documents as $document) {
                    if (isset($document['file']) && $document['file']) {
                        $documentPath = $this->uploadDocument(
                            $document['file'],
                            'students/documents'
                        );

                        StudentDocument::create([
                            'student_id' => $student->id,
                            'document_type' => $document['document_type'] ?? 'other',
                            'document_name' => $document['document_name'],
                            'document_path' => $documentPath,
                            'quantity' => $document['quantity'] ?? 1,
                            'remarks' => $document['remarks'] ?? null,
                            'status' => true,
                        ]);
                    }
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Create User record for Student login (if email is provided)
            |--------------------------------------------------------------------------
            */

            if (!empty($request->email)) {
                $studentRole = Role::firstOrCreate(
                    ['name' => 'Student', 'guard_name' => 'web']
                );

                $userPassword = $request->password
                    ? $request->password
                    : ($request->dob ? date('dmY', strtotime($request->dob)) : 'Student@123');

                $user = User::create([
                    'role_id'       => $studentRole->id,
                    'name'          => trim($request->first_name . ' ' . $request->last_name),
                    'email'         => $request->email,
                    'mobile'        => $request->mobile,
                    'password'      => Hash::make($userPassword),
                    'profile_photo' => $photo,
                    'status'        => 1,
                ]);

                $student->update([
                    'user_id' => $user->id,
                ]);
            }

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Student Registered Successfully.',

                'data'    => $student

            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => $e->getMessage()

            ], 500);

        }
    }


        /*
    |--------------------------------------------------------------------------
    | Show Student
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $student = Student::with([

            'academicYear',

            'class',

            'section',

            'parents',

            'documents',

            'user',

        ])->findOrFail($id);

        return response()->json([

            'success' => true,

            'data' => $student

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Student
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validator = Validator::make(
            $request->all(),
            [

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

                'email' =>
                    'required|email|max:150|unique:students,email,' . $student->id . '|unique:users,email,' . ($student->user_id ? $student->user_id : 'NULL') . ',id',

                'mobile' => 'nullable|max:20',

                'password' => 'nullable|min:6|max:100',

                'aadhaar_number' =>
                    'nullable|unique:students,aadhaar_number,' . $student->id,

                'apaar_id' =>
                    'nullable|unique:students,apaar_id,' . $student->id,

                'pen_number' =>
                    'nullable|unique:students,pen_number,' . $student->id,

                'photo' => 'nullable|image|max:2048',

                'father_name' => 'required',

                'father_mobile' => 'required',

            ]
        );

        if ($validator->fails()) {

            return response()->json([

                'success' => false,

                'errors' => $validator->errors()

            ], 422);

        }

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Upload New Photo
            |--------------------------------------------------------------------------
            */

            $photo = $student->photo;

            if ($request->hasFile('photo')) {

                if (
                    $photo &&
                    Storage::disk('public')->exists($photo)
                ) {

                    Storage::disk('public')->delete($photo);

                }

                $photo = $this->uploadDocument(

                    $request->file('photo'),

                    'students/profile'

                );

            }

            /*
            |--------------------------------------------------------------------------
            | Parent Mapping
            |--------------------------------------------------------------------------
            */

            $mapping = StudentParent::where(

                'student_id',

                $student->id

            )->first();

            $parent = ParentModel::find(

                $mapping->parent_id

            );

            /*
            |--------------------------------------------------------------------------
            | Update Parent
            |--------------------------------------------------------------------------
            */

            $parent->update([

                'father_name'       => $request->father_name,

                'father_mobile'     => $request->father_mobile,

                'father_email'      => $request->father_email,

                'father_occupation' => $request->father_occupation,

                'father_income'     => $request->father_income,

                'mother_name'       => $request->mother_name,

                'mother_mobile'     => $request->mother_mobile,

                'mother_email'      => $request->mother_email,

                'mother_occupation' => $request->mother_occupation,

                'mother_income'     => $request->mother_income,

                'guardian_name'     => $request->guardian_name,

                'guardian_relation' => $request->guardian_relation,

                'guardian_mobile'   => $request->guardian_mobile,

                'address'           => $request->address,

                'city'              => $request->city,

                'state'             => $request->state,

                'country'           => $request->country,

                'pincode'           => $request->pincode,

                'updated_by'        => auth()->id(),

            ]);

            /*
            |--------------------------------------------------------------------------
            | Update Student
            |--------------------------------------------------------------------------
            */

            $student->update([

                'academic_year_id'     => $request->academic_year_id,

                'class_id'             => $request->class_id,

                'section_id'           => $request->section_id,

                'admission_date'       => $request->admission_date,

                'admission_type'       => $request->admission_type,

                'first_name'           => $request->first_name,

                'middle_name'          => $request->middle_name,

                'last_name'            => $request->last_name,

                'full_name'            => trim(

                    $request->first_name . ' ' .

                    $request->middle_name . ' ' .

                    $request->last_name

                ),

                'gender'               => $request->gender,

                'dob'                  => $request->dob,

                'email'                => $request->email,

                'mobile'               => $request->mobile,

                'blood_group'          => $request->blood_group,

                'category'             => $request->category,

                'caste'                => $request->caste,

                'sub_caste'            => $request->sub_caste,

                'religion'             => $request->religion,

                'nationality'          => $request->nationality,

                'mother_tongue'        => $request->mother_tongue,

                'birth_place'          => $request->birth_place,

                'house'                => $request->house,

                'aadhaar_number'       => $request->aadhaar_number,

                'apaar_id'             => $request->apaar_id,

                'pen_number'           => $request->pen_number,

                'birth_certificate_no' => $request->birth_certificate_no,

                'previous_school'      => $request->previous_school,

                'transport_required'   => $request->transport_required ?? 0,

                'hostel_required'      => $request->hostel_required ?? 0,

                'photo'                => $photo,

                'remarks'              => $request->remarks,

                'updated_by'           => auth()->id(),

            ]);

            /*
            |--------------------------------------------------------------------------
            | Handle Student Documents Update
            |--------------------------------------------------------------------------
            */

            if ($request->has('documents') && is_array($request->documents)) {
                // Delete existing documents
                StudentDocument::where('student_id', $student->id)->delete();

                // Create new documents
                foreach ($request->documents as $document) {
                    if (isset($document['file']) && $document['file']) {
                        $documentPath = $this->uploadDocument(
                            $document['file'],
                            'students/documents'
                        );

                        StudentDocument::create([
                            'student_id' => $student->id,
                            'document_type' => $document['document_type'] ?? 'other',
                            'document_name' => $document['document_name'],
                            'document_path' => $documentPath,
                            'quantity' => $document['quantity'] ?? 1,
                            'remarks' => $document['remarks'] ?? null,
                            'status' => true,
                        ]);
                    }
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Sync / Create User record for Student login
            |--------------------------------------------------------------------------
            */

            if (!empty($request->email)) {
                $studentRole = Role::firstOrCreate(
                    ['name' => 'Student', 'guard_name' => 'web']
                );

                $userData = [
                    'role_id'       => $studentRole->id,
                    'name'          => trim($request->first_name . ' ' . $request->last_name),
                    'email'         => $request->email,
                    'mobile'        => $request->mobile,
                    'profile_photo' => $photo,
                    'status'        => 1,
                ];

                if (!empty($request->password)) {
                    $userData['password'] = Hash::make($request->password);
                }

                if ($student->user_id && $student->user) {
                    $student->user->update($userData);
                } else {
                    if (empty($request->password)) {
                        $defaultPass = $request->dob
                            ? date('dmY', strtotime($request->dob))
                            : 'Student@123';
                        $userData['password'] = Hash::make($defaultPass);
                    }

                    $user = User::create($userData);
                    $student->update(['user_id' => $user->id]);
                }
            }

            DB::commit();

            return response()->json([

                'success' => true,

                'message' => 'Student Updated Successfully.',

                'data' => $student

            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,

                'message' => $e->getMessage()

            ], 500);

        }
    }

        /*
    |--------------------------------------------------------------------------
    | Inactive Students
    |--------------------------------------------------------------------------
    */

    public function inactive()
    {
        $students = Student::with([
            'academicYear',
            'class',
            'section',
            'parents',
            'user'
        ])
        ->where('status',0)
        ->latest()
        ->get();

        return response()->json([

            'success' => true,

            'data' => $students

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Move Student to Inactive
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $student = Student::findOrFail($id);

        $student->update([

            'status' => 0,

            'updated_by' => auth()->id(),

        ]);

        if ($student->user_id && $student->user) {
            $student->user->update([
                'status' => 0,
            ]);
        }

        return response()->json([

            'success' => true,

            'message' => 'Student moved to inactive successfully.'

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Restore Student
    |--------------------------------------------------------------------------
    */

    public function restore($id)
    {
        $student = Student::findOrFail($id);

        $student->update([

            'status' => 1,

            'updated_by' => auth()->id(),

        ]);

        if ($student->user_id && $student->user) {
            $student->user->update([
                'status' => 1,
            ]);
        }

        return response()->json([

            'success' => true,

            'message' => 'Student restored successfully.'

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Dropdown Data
    |--------------------------------------------------------------------------
    */

    public function dropdowns()
    {
        return response()->json([

            'success' => true,

            'courses' => Course::where('is_active', true)
                ->orderBy('order_number')
                ->get([
                    'id',
                    'title'
                ]),

            'academicYears' => AcademicYear::where('status',1)
                ->orderBy('academic_year')
                ->get([
                    'id',
                    'academic_year'
                ]),

            'classes' => Classes::where('status',1)
                ->orderBy('class_name')
                ->get([
                    'id',
                    'class_name'
                ]),

            'sections' => Section::where('status',1)
                ->orderBy('section_name')
                ->get([
                    'id',
                    'section_name'
                ]),

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Sections by Class
    |--------------------------------------------------------------------------
    */

    public function sectionsByClass($classId)
    {
        $sections = Section::where('class_id', $classId)
            ->where('status', 1)
            ->orderBy('section_name')
            ->get([
                'id',
                'section_name'
            ]);

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }

    /*
|--------------------------------------------------------------------------
| Check Admission Number Availability
|--------------------------------------------------------------------------
*/

public function checkAdmissionNumber(Request $request)
{
    $exists = Student::where(
        'admission_no',
        $request->admission_no
    )->exists();

    return response()->json([

        'success' => true,

        'exists' => $exists

    ]);
}

/*
|--------------------------------------------------------------------------
| Check Student Code Availability
|--------------------------------------------------------------------------
*/

public function checkStudentCode(Request $request)
{
    $exists = Student::where(
        'student_code',
        $request->student_code
    )->exists();

    return response()->json([

        'success' => true,

        'exists' => $exists

    ]);
}

/*
|--------------------------------------------------------------------------
| Search Students
|--------------------------------------------------------------------------
*/

public function search(Request $request)
{
    $keyword = $request->keyword;

    $students = Student::with([
        'class',
        'section'
    ])

    ->where('status',1)

    ->where(function ($query) use ($keyword) {

        $query->where('student_code','LIKE',"%{$keyword}%")

            ->orWhere('admission_no','LIKE',"%{$keyword}%")

            ->orWhere('first_name','LIKE',"%{$keyword}%")

            ->orWhere('middle_name','LIKE',"%{$keyword}%")

            ->orWhere('last_name','LIKE',"%{$keyword}%")

            ->orWhere('full_name','LIKE',"%{$keyword}%");

    })

    ->limit(20)

    ->get();

    return response()->json([

        'success' => true,

        'data' => $students

    ]);
}

/*
|--------------------------------------------------------------------------
| Class-wise Students
|--------------------------------------------------------------------------
*/

public function classStudents($classId)
{
    $students = Student::where('class_id',$classId)

        ->where('status',1)

        ->orderBy('first_name')

        ->get();

    return response()->json([

        'success' => true,

        'data' => $students

    ]);
}

/*
|--------------------------------------------------------------------------
| Section-wise Students
|--------------------------------------------------------------------------
*/

public function sectionStudents($sectionId)
{
    $students = Student::where('section_id',$sectionId)

        ->where('status',1)

        ->orderBy('first_name')

        ->get();

    return response()->json([

        'success' => true,

        'data' => $students

    ]);
}

/*
|--------------------------------------------------------------------------
| Student Mobile Dashboard
|--------------------------------------------------------------------------
*/

public function dashboard(Request $request)
{
    $user = $request->user();

    $student = Student::with([
        'course',
        'academicYear',
        'class',
        'section',
    ])
    ->where('user_id', $user->id)
    ->where('status', 1)
    ->first();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student record not found for this user.',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'message' => 'Student dashboard loaded successfully.',

        'student' => [
            'id' => $student->id,
            'student_code' => $student->student_code,
            'admission_no' => $student->admission_no,
            'roll_no' => $student->roll_no,

            'first_name' => $student->first_name,
            'middle_name' => $student->middle_name,
            'last_name' => $student->last_name,
            'full_name' => $student->full_name,

            'email' => $student->email,
            'mobile' => $student->mobile,

            'photo' => $student->photo,

            'course' => $student->course,
            'academic_year' => $student->academicYear,
            'class' => $student->class,
            'section' => $student->section,
        ],
    ]);
}

/*
|--------------------------------------------------------------------------
| Student Mobile Profile
|--------------------------------------------------------------------------
*/

public function profile(Request $request)
{
    $user = $request->user();

    $student = Student::with([
        'course',
        'academicYear',
        'class',
        'section',
        'parents',
        'documents',
    ])
    ->where('user_id', $user->id)
    ->where('status', 1)
    ->first();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student record not found for this user.',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'message' => 'Student profile loaded successfully.',

        'student' => [
            // Basic
            'id' => $student->id,
            'student_code' => $student->student_code,
            'admission_no' => $student->admission_no,
            'roll_no' => $student->roll_no,

            // Name
            'first_name' => $student->first_name,
            'middle_name' => $student->middle_name,
            'last_name' => $student->last_name,
            'full_name' => $student->full_name,

            // Academic
            'course' => $student->course,
            'academic_year' => $student->academicYear,
            'class' => $student->class,
            'section' => $student->section,

            // Admission
            'admission_date' => $student->admission_date,
            'admission_type' => $student->admission_type,
            'admission_status' => $student->admission_status,

            // Contact
            'email' => $student->email,
            'mobile' => $student->mobile,

            // Personal
            'gender' => $student->gender,
            'dob' => $student->dob,
            'blood_group' => $student->blood_group,
            'category' => $student->category,
            'caste' => $student->caste,
            'sub_caste' => $student->sub_caste,
            'religion' => $student->religion,
            'nationality' => $student->nationality,
            'mother_tongue' => $student->mother_tongue,
            'birth_place' => $student->birth_place,
            'house' => $student->house,

            // Identification
            'aadhaar_number' => $student->aadhaar_number,
            'apaar_id' => $student->apaar_id,
            'pen_number' => $student->pen_number,
            'birth_certificate_no' => $student->birth_certificate_no,

            // Previous Education
            'previous_school' => $student->previous_school,

            // Facilities
            'transport_required' => $student->transport_required,
            'hostel_required' => $student->hostel_required,

            // Photo
            'photo' => $student->photo,

            // Other
            'remarks' => $student->remarks,
            'status' => $student->status,
            'is_self_registered' => $student->is_self_registered,
            'registration_source' => $student->registration_source,
            'advance_amount_paid' => $student->advance_amount_paid,

            // Parent
            'parents' => $student->parents,

            // Documents
            'documents' => $student->documents,
        ],
    ]);
}


public function subjects(Request $request)
{
    $user = $request->user();

    // Find the logged-in student's record
    $student = Student::where('user_id', $user->id)
        ->where('status', 1)
        ->first();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student record not found for this user.',
        ], 404);
    }

    if (!$student->class_id) {
        return response()->json([
            'success' => false,
            'message' => 'Class is not assigned to this student.',
        ], 404);
    }

    // Get subjects assigned to student's class
    $subjects = DB::table('class_subjects')
        ->join(
            'subjects',
            'class_subjects.subject_id',
            '=',
            'subjects.id'
        )
        ->where('class_subjects.class_id', $student->class_id)
        ->where('class_subjects.status', 1)
        ->where('subjects.status', 1)
        ->orderBy('class_subjects.display_order')
        ->select([
            'subjects.id',
            'subjects.subject_name',
            'subjects.subject_code',
            'subjects.subject_type',
            'subjects.description',
            'class_subjects.is_compulsory',
            'class_subjects.display_order',
        ])
        ->get();

    return response()->json([
        'success' => true,
        'message' => 'Student subjects loaded successfully.',

        'student' => [
            'id' => $student->id,
            'name' => $student->full_name,
            'class_id' => $student->class_id,
        ],

        'subjects' => $subjects,
    ]);
}

}