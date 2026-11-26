<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'title', 'category', 'file_path', 'is_new', 'download_count', 'is_active'
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'is_active' => 'boolean',
    ];
}
