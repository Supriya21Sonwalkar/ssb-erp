<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'subject_name',
        'subject_code',
        'subject_type',
        'description',
        'display_order',
        'status',
        'created_by'
    ];

    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }



    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }
    public function teacherAllocations()
{
    return $this->hasMany(
        TeacherAllocation::class,
        'subject_id'
    );
}
}   