<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunicationNotice extends Model
{
    protected $table = 'communication_notices';

    protected $fillable = [
        'notice_no',
        'title',
        'description',
        'notice_type',
        'priority',
        'publish_date',
        'expiry_date',
        'attachment',
        'target_type',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'publish_date' => 'date',
        'expiry_date' => 'date',
        'is_active' => 'boolean',
    ];
}