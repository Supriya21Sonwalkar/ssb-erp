<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LectureAttendance extends Model
{
    protected $table = 'lecture_attendances';

    protected $fillable = [
        'lecture_attendance_session_id',
        'student_id',
        'attendance_status',
        'remarks',
    ];

    /*
    |--------------------------------------------------------------------------
    | Lecture Attendance Session
    |--------------------------------------------------------------------------
    */

    public function session()
    {
        return $this->belongsTo(
            LectureAttendanceSession::class,
            'lecture_attendance_session_id'
        );
    }
}