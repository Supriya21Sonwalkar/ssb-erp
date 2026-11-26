<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetSubcategory extends Model
{
    protected $table = 'asset_subcategories';

    protected $fillable = [
        'category_id',
        'subcategory_name',
        'subcategory_code',
        'description',
        'status',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'status' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(
            AssetCategory::class,
            'category_id'
        );
    }
}