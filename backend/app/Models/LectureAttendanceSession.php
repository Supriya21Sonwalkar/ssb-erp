<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\LectureAttendance;



class LectureAttendanceSession extends Model
{
    protected $table = 'lecture_attendance_sessions';

    protected $fillable = [
        'academic_year_id',
        'class_id',
        'section_id',
        'lecture_date',
        'lecture_no',
        'subject_id',
        'teacher_id',
        'start_time',
        'end_time',
        'is_locked',
        'marked_by',
    ];

    protected $casts = [
        'lecture_date' => 'date',
        'is_locked' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Lecture Attendance Records
    |--------------------------------------------------------------------------
    */

    public function attendances()
    {
        return $this->hasMany(
            LectureAttendance::class,
            'lecture_attendance_session_id'
        );
    }
}