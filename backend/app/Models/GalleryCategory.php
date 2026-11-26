<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryCategory extends Model
{
    protected $fillable = ['name', 'slug', 'order_number'];

    public function items()
    {
        return $this->hasMany(GalleryItem::class)->orderBy('order_number');
    }
}
