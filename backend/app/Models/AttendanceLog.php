<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    protected $table = 'attendance_logs';

    protected $fillable = [

        'attendance_id',

        'old_status',

        'new_status',

        'changed_by',

        'reason',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function attendance()
    {
        return $this->belongsTo(
            StudentAttendance::class,
            'attendance_id'
        );
    }

    public function changedBy()
    {
        return $this->belongsTo(
            User::class,
            'changed_by'
        );
    }
}