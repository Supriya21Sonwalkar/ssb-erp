<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $table = 'assets';

    protected $fillable = [
        'category_id',
        'subcategory_id',
        'asset_name',
        'asset_code',
        'description',
        'status',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'subcategory_id' => 'integer',
        'status' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(AssetCategory::class, 'category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(AssetSubcategory::class, 'subcategory_id');
    }
}