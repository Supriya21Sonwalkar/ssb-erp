<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'academic_year_id',
        'class_id',
        'section_id',
        'day',
        'period_id',
        'subject_id',
        'teacher_id',
        'status',
        'created_by'
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    // Change Employee::class if required
    public function teacher()
    {
        return $this->belongsTo(Employee::class, 'teacher_id');
    }
}