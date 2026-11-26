<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeComponent extends Model
{
    protected $table = 'fee_components';

    protected $fillable = [
        'name',
        'code',
        'component_type',
        'is_active',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function feeStructures()
    {
        return $this->hasMany(
            FeeStructure::class,
            'fee_component_id'
        );
    }
}