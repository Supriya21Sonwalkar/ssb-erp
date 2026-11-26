<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetCategory extends Model
{
    protected $table = 'asset_categories';

    protected $fillable = [
        'category_name',
        'category_code',
        'description',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

public function subcategories()
{
    return $this->hasMany(
        AssetSubcategory::class,
        'category_id'
    );
}
}