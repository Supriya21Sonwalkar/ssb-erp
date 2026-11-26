<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = [
        'class_id',
        'section_name',
        'room_number',
        'capacity',
        'display_order',
        'status',
        'created_by'
    ];

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function teacherAllocations()
    {
        return $this->hasMany(TeacherAllocation::class);
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }
}