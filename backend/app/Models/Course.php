<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Course extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
    protected $fillable = [
        'title', 'subtitle', 'slug', 'description', 'icon_class', 'order_number', 'features', 'is_active', 'fees'
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'fees'     => 'float',
    ];

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }
    public function feeStructures()
    {
        return $this->hasMany(
            FeeStructure::class,
            'course_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Student Fee Waivers
    |--------------------------------------------------------------------------
    */

    public function studentFeeWaivers()
    {
        return $this->hasMany(
            StudentFeeWaiver::class,
            'course_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Fee Payments
    |--------------------------------------------------------------------------
    */

    public function feePayments()
    {
        return $this->hasMany(
            FeePayment::class,
            'course_id'
        );
    }
}
