<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'cadet_name', 'entry_type', 'batch_year', 'quote', 'photo_path', 'is_featured', 'order_number'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];
}
