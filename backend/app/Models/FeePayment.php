<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeePayment extends Model
{
    protected $table = 'fee_payments';

    protected $fillable = [

        'student_id',

        'course_id',

        'fee_structure_id',

        'receipt_no',

        'payment_date',

        'amount',

        'payment_mode',

        'transaction_reference',

        'cheque_no',

        'bank_name',

        'remarks',

        'status',

        'received_by',

    ];


    protected $casts = [

        'payment_date' => 'date',

        'amount' => 'decimal:2',

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
    | Received By
    |--------------------------------------------------------------------------
    */

    public function receiver()
    {
        return $this->belongsTo(
            User::class,
            'received_by'
        );
    }

}