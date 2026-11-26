<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Subject;
use App\Models\Employee;
use App\Models\User;

class TeacherAllocation extends Model
{
    protected $table = 'teacher_allocations';

    protected $fillable = [

        'academic_year_id',

        'class_id',

        'subject_id',

        'employee_id',

        'status',

        'created_by',

        'updated_by',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Academic Year
     */
    public function academicYear()
    {
        return $this->belongsTo(
            AcademicYear::class,
            'academic_year_id'
        );
    }

    /**
     * Class
     */
    public function class()
    {
        return $this->belongsTo(
            Classes::class,
            'class_id'
        );
    }

    /**
     * Subject
     */
    public function subject()
    {
        return $this->belongsTo(
            Subject::class,
            'subject_id'
        );
    }

    /**
     * Teacher (Employee)
     */
    public function employee()
    {
        return $this->belongsTo(
            Employee::class,
            'employee_id'
        );
    }

    /**
     * Created By
     */
    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    /**
     * Updated By
     */
    public function updatedBy()
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}