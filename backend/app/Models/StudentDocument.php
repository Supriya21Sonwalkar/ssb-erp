<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentDocument extends Model
{
    protected $fillable = [

        'student_id',

        'document_type',

        'document_name',

        'document_path',

        'quantity',

        'remarks',

        'status',

    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}