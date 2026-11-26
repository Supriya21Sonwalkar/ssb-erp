<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    protected $table = 'parents';

    protected $fillable = [

        // Father Details
        'father_name',
        'father_mobile',
        'father_email',
        'father_occupation',
        'father_income',
        'father_birth_date',
        'father_birth_place',
        'father_religion',
        'father_education_qualification',
        'father_whatsapp',
        'father_pan_election_no',
        'father_aadhaar_number',

        // Mother Details
        'mother_name',
        'mother_mobile',
        'mother_email',
        'mother_occupation',
        'mother_income',
        'mother_birth_date',
        'mother_birth_place',
        'mother_religion',
        'mother_education_qualification',
        'mother_whatsapp',
        'mother_pan_election_no',
        'mother_aadhaar_number',

        // Guardian Details
        'guardian_name',
        'guardian_relation',
        'guardian_mobile',

        // Address
        'address',
        'city',
        'state',
        'country',
        'pincode',

        'status',

        'created_by',
        'updated_by',

    ];

    /*
    |--------------------------------------------------------------------------
    | Students
    |--------------------------------------------------------------------------
    */

    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'student_parent',
            'parent_id',
            'student_id'
        );
    }
}