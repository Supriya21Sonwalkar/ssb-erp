<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeworkAssignment extends Model
{
    protected $table = 'homework_assignments';

    protected $fillable = [
        'academic_year_id',
        'class_id',
        'section_id',
        'subject_id',

        'title',
        'homework_type',
        'description',

        'assigned_date',
        'due_date',

        'total_marks',

        'allow_late_submission',

        'status',

        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'assigned_date' => 'date',
        'due_date' => 'date',
        'total_marks' => 'decimal:2',
        'allow_late_submission' => 'boolean',
    ];


    /*
    |--------------------------------------------------------------------------
    | Attachments
    |--------------------------------------------------------------------------
    */

    public function attachments()
    {
        return $this->hasMany(
            HomeworkAssignmentAttachment::class,
            'homework_assignment_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Submissions
    |--------------------------------------------------------------------------
    */

    public function submissions()
    {
        return $this->hasMany(
            HomeworkSubmission::class,
            'homework_assignment_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Class
    |--------------------------------------------------------------------------
    */

    public function class()
    {
        return $this->belongsTo(
            Classes::class,
            'class_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Section
    |--------------------------------------------------------------------------
    */

    public function section()
    {
        return $this->belongsTo(
            Section::class,
            'section_id'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Subject
    |--------------------------------------------------------------------------
    */

    public function subject()
    {
        return $this->belongsTo(
            Subject::class,
            'subject_id'
        );
    }
}