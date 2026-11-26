<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Designation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'designation_name',
        'designation_code',
        'description',
        'status',
        'created_by',
        'updated_by',
    ];
}