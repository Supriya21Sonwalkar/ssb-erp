<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructureItem extends Model
{
    protected $table = 'fee_structure_items';

    protected $fillable = [
        'fee_structure_id',
        'fee_head',
        'description',
        'amount',
        'order_number',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];


    /*
    |--------------------------------------------------------------------------
    | Fee Structure
    |--------------------------------------------------------------------------
    */

    public function feeStructure()
    {
        return $this->belongsTo(
            FeeStructure::class,
            'fee_structure_id'
        );
    }
}