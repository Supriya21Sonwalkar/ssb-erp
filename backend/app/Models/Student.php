<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [

        'user_id',

        'student_code',
        'admission_no',
        'roll_no',
        'form_no',

        'course_id',
        'academic_year_id',
        'class_id',
        'section_id',
        'class_admitted_aws',

        'admission_date',
        'admission_type',
        'admission_status',

        'first_name',
        'middle_name',
        'last_name',
        'full_name',

        'gender',
        'dob',

        'email',
        'mobile',

        'blood_group',
        'category',
        'caste',
        'sub_caste',
        'religion',
        'nationality',
        'mother_tongue',
        'birth_place',
        'birth_taluka',
        'birth_district',
        'birth_state',
        'birth_country',
        'house',
        'landmark',

        'aadhaar_number',
        'apaar_id',
        'pen_number',
        'birth_certificate_no',

        'previous_school',
        'previous_school_u_dise_no',
        'previous_school_address',
        'previous_school_board',
        'previous_school_class',
        'previous_school_percentage_grade',

        'transport_required',
        'hostel_required',

        'photo',

        'remarks',
        'other_illness',
        'gr_no',
        'sibling_info',
        'saral_id',

        'caution_fee_receipt_no',

        'status',

        'is_self_registered',
        'registration_source',
        'advance_amount_paid',

        'created_by',
        'updated_by',
    ];

    /*
    |--------------------------------------------------------------------------
    | User Relationship (for login credentials)
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Academic Relationships
    |--------------------------------------------------------------------------
    */

    public function course()
    {
        return $this->belongsTo(
            Course::class,
            'course_id'
        );
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function class()
    {
        return $this->belongsTo(Classes::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Parent Relationship
    |--------------------------------------------------------------------------
    */

    public function parents()
    {
        return $this->belongsToMany(
            ParentModel::class,
            'student_parent',
            'student_id',
            'parent_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Documents
    |--------------------------------------------------------------------------
    */

    public function documents()
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function feePayments()
    {
        return $this->hasMany(
            FeePayment::class,
            'student_id'
        );
    }
}