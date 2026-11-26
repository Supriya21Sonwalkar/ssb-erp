<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeworkSubmission extends Model
{
    protected $table = 'homework_submissions';

    protected $fillable = [
        'homework_assignment_id',
        'student_id',
        'submission_text',
        'submission_date',
        'attachment_name',
        'attachment_path',
        'attachment_type',
        'attachment_size',
        'status',
        'marks',
        'teacher_remarks',
        'checked_by',
        'checked_at',
    ];

    protected $casts = [
        'submission_date' => 'datetime',
        'checked_at' => 'datetime',
        'marks' => 'decimal:2',
    ];


    /*
    |--------------------------------------------------------------------------
    | Homework
    |--------------------------------------------------------------------------
    */

    public function homework()
    {
        return $this->belongsTo(
            HomeworkAssignment::class,
            'homework_assignment_id'
        );
    }


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
    | Checked By
    |--------------------------------------------------------------------------
    */

    public function checkedBy()
    {
        return $this->belongsTo(
            User::class,
            'checked_by'
        );
    }
}