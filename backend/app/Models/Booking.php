<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Booking extends Model
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
        'full_name', 'date_of_birth', 'gender',
        'father_name', 'mother_name',
        'phone', 'email',
        'address', 'city', 'state',
        'course_id', 'course_interest', 'fees_amount', 'payment_status',
        'message', 'ip_address', 'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'fees_amount'   => 'float',
        'created_at'    => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
