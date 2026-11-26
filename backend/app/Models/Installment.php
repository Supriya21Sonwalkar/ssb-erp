<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    protected $table = 'installments';

    protected $fillable = [
        'academic_year_id',
        'name',
        'start_date',
        'end_date',
        'status',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'boolean',
    ];

    public function academicYear()
    {
        return $this->belongsTo(
            AcademicYear::class,
            'academic_year_id'
        );
    }

    public function feeStructures()
    {
        return $this->hasMany(
            FeeStructure::class,
            'installment_id'
        );
    }
}
