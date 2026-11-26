<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Models\Employee;

 

class User extends Authenticatable
{
     use HasApiTokens, Notifiable, SoftDeletes;

    protected $fillable = [

        'employee_id',

        'role_id',

        'name',
        'email',
        'mobile',

        'password',

        'profile_photo',

        'status',

    ];

    protected $hidden = [

        'password',
        'remember_token',

    ];

    protected $casts = [

        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',

        'status' => 'boolean',

        'password' => 'hashed',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
    public function student()
    {
        return $this->hasOne(\App\Models\Student::class, 'user_id');
    }
}