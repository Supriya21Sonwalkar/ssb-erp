<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    protected $table = 'student_attendance';

    protected $fillable = [

        'attendance_session_id',

        'student_id',

        'attendance_status',

        'arrival_time',

        'departure_time',

        'late_minutes',

        'remarks',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function attendanceSession()
    {
        return $this->belongsTo(
            AttendanceSession::class,
            'attendance_session_id'
        );
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function logs()
    {
        return $this->hasMany(
            AttendanceLog::class,
            'attendance_id'
        );
    }
}