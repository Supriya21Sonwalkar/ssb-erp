<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    protected $table = 'fee_structures';

    protected $fillable = [
        'fee_component_id',
        'course_id',
        'academic_year_id',
        'installment_id',
        'name',
        'total_amount',
        'effective_from',
        'effective_to',
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
        'status' => 'boolean',
    ];


    /*
    |--------------------------------------------------------------------------
    | Fee Component
    |--------------------------------------------------------------------------
    */

    public function feeComponent()
    {
        return $this->belongsTo(
            FeeComponent::class,
            'fee_component_id'
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
    | Academic Year
    |--------------------------------------------------------------------------
    */

    public function academicYear()
    {
        return $this->belongsTo(
            AcademicYear::class,
            'academic_year_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Installment
    |--------------------------------------------------------------------------
    */

    public function installment()
    {
        return $this->belongsTo(
            Installment::class,
            'installment_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Fee Structure Items
    |--------------------------------------------------------------------------
    */

    public function items()
    {
        return $this->hasMany(
            FeeStructureItem::class,
            'fee_structure_id'
        )->orderBy('order_number');
    }


    /*
    |--------------------------------------------------------------------------
    | Student Waivers
    |--------------------------------------------------------------------------
    */

    public function studentWaivers()
    {
        return $this->hasMany(
            StudentFeeWaiver::class,
            'fee_structure_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Payments
    |--------------------------------------------------------------------------
    */

    public function payments()
    {
        return $this->hasMany(
            FeePayment::class,
            'fee_structure_id'
        );
    }
}