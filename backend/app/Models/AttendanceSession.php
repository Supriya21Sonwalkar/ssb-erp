<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class AttendanceSession extends Model
{
    protected $table = 'attendance_sessions';

    protected $fillable = [

        'academic_year_id',

        'class_id',

        'section_id',

        'attendance_date',

        'attendance_type',

        'is_locked',

        'marked_by',

        'verified_by',

        'remarks',
        'status',

    ];

    protected $casts = [

        'attendance_date' => 'date',

        'is_locked' => 'boolean',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class, 'attendance_session_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function markedBy()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}