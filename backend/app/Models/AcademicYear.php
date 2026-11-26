<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'academic_year',
        'start_date',
        'end_date',
        'is_current',
        'status',
        'created_by'
    ];

public function teacherAllocations()
{
    return $this->hasMany(
        TeacherAllocation::class,
        'academic_year_id'
    );
}

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }
}