<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class HomepageMedia extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
public function items()
{
    return $this->hasMany(GalleryItem::class, 'gallery_category_id')
                ->orderBy('order_number');
}
    protected $fillable = [
        'title', 'video_path', 'modal_video_path', 'thumbnail_path', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
