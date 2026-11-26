<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\AcademicYear;

class Classes extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        
        'class_name',
        'class_code',
        'display_order',
        'status',
        'created_by'
    ];

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class, 'class_id');
    }



    public function timetables()
    {
        return $this->hasMany(Timetable::class, 'class_id');
    }
     public function academicYear(): BelongsTo
    {
        return $this->belongsTo(
            AcademicYear::class,
            'academic_year_id'
        );
    }
    public function teacherAllocations()
{
    return $this->hasMany(
        TeacherAllocation::class,
        'class_id'
    );
}
}