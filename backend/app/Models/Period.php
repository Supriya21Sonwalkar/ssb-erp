<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
    protected $fillable = [
        'period_name',
        'period_no',
        'start_time',
        'end_time',
        'is_break',
        'status',
        'created_by'
    ];

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }
}