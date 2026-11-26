<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'department_name',
        'department_code',
        'description',
        'status',
        'created_by',
        'updated_by',
    ];
}