<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentFeeWaiver extends Model
{
    protected $table = 'student_fee_waivers';

    protected $fillable = [
        'student_id',
        'course_id',
        'fee_structure_id',
        'waiver_type',
        'waiver_value',
        'waiver_amount',
        'reason',
        'status',
        'approved_by',
        'approved_at',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'waiver_value' => 'decimal:2',
        'waiver_amount' => 'decimal:2',
        'status' => 'boolean',
        'approved_at' => 'datetime',
    ];


    /*
    |--------------------------------------------------------------------------
    | Student
    |--------------------------------------------------------------------------
    */

    public function student()
    {
        return $this->belongsTo(
            Student::class,
            'student_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Course
    |--------------------------------------------------------------------------
    */

    public function course()
    {
        return $this->belongsTo(
            Course::class,
            'course_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Fee Structure
    |--------------------------------------------------------------------------
    */

    public function feeStructure()
    {
        return $this->belongsTo(
            FeeStructure::class,
            'fee_structure_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Approved By
    |--------------------------------------------------------------------------
    */

    public function approvedBy()
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Created By
    |--------------------------------------------------------------------------
    */

    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}