<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Role;
use App\Models\User;
use App\Models\TeacherAllocation;


class Employee extends Model
{

    protected $fillable = [

        // Basic Information
        'employee_code',
        'first_name',
        'middle_name',
        'last_name',
        'full_name',
        'profile_photo',
        'phone_number',
        'whatsapp_number',
        'dob',
        'gender',
        'region',
        'caste',
        'sub_caste',
        'religion',
        'employee_type',

        // Address
        'present_address',
        'permanent_address',

        // Employment
        'branch_id',
        'department_id',
        'designation_id',
        'joining_date',
        'last_working_date',
        'start_time',
        'end_time',
        'saturday_in_time',
        'saturday_out_time',
        'shift',
        'reference',
        'marital_status',

        // Contact
        'email',
        'emergency_contact_1_name',
        'emergency_contact_1_relation',
        'emergency_contact_1_place',
        'emergency_contact_1_phone',
        'emergency_contact_2_name',
        'emergency_contact_2_relation',
        'emergency_contact_2_place',
        'emergency_contact_2_phone',

        // Bank Details
        'bank_name',
        'branch_name',
        'bank_account_number',
        'bank_account_name',
        'ifsc_code',

        // Organisation
        'organisation',
        'organisation_id',

        // Salary
        'category',
        'old_salary',
        'salary_scale',
        'retention_amount',

        // Government Details
        'uid_number',
        'pf_number',
        'pf',
        'pt',
        'esic',
        'mlwf',
        'tds',
        'qualification',
        'aadhaar_number',
        'pan_number',

        // Teaching
        'teaching_subject',

        // Reporting
        'reporting_id',
        'reporting_type',
        'buddy_id',

        // Contract
        'contract_start_date',
        'contract_end_date',

        // Social Media
        'instagram_id',
        'twitter_id',
        'facebook_id',

        // Working Status
        'working_status',

        // Experience
        'experience_company',
        'experience_designation',
        'experience_last_salary',
        'experience_duration',
        'experience_job_description',
        'experience_reason_for_leaving',
        'experience_company_contact',

        // Login
        'username',
        'role_id',

        // Documents
        'pan_card_photo',
        'aadhaar_card_photo',
        'signature',

        'bank_details_document',
        'driving_license_document',
        'marksheet_10th',
        'marksheet_12th',
        'graduation_certificate',
        'post_graduation_certificate',
        'policy_document',
        'other_documents',

        // Attendance
        'attendance_status',
        'attendance_log_status',
        'attendance_type',

        // Verification
        'verify_status',

        // Recruitment
        'recruitment_number',
        'reason',

        // Misc
        'new_user',
        'attendance_time_status',
        'signature_id',
        'data_fetch',
        'temp_status',
        'id_card_status',
        'tp_status',

        // Status
        'active',

        // Audit
        'added_by',
        'updated_by',
    ];

    protected $casts = [

        'dob' => 'date',
        'joining_date' => 'date',
        'last_working_date' => 'date',

        'contract_start_date' => 'date',
        'contract_end_date' => 'date',

        'old_salary' => 'decimal:2',
        'salary_scale' => 'decimal:2',
        'retention_amount' => 'decimal:2',

        'active' => 'boolean',

        'attendance_status' => 'boolean',
        'attendance_log_status' => 'boolean',
        'verify_status' => 'boolean',
        'new_user' => 'boolean',
        'attendance_time_status' => 'boolean',
        'data_fetch' => 'boolean',
        'temp_status' => 'boolean',
        'tp_status' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    // public function organisationMaster()
    // {
    //     return $this->belongsTo(Organisation::class, 'organisation_id');
    // }

    public function reportingManager()
    {
        return $this->belongsTo(Employee::class, 'reporting_id');
    }

    public function buddy()
    {
        return $this->belongsTo(Employee::class, 'buddy_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function teacherAllocations()
    {
        return $this->hasMany(
            TeacherAllocation::class,
            'employee_id'
        );
    }

}