<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuPermission extends Model
{
    protected $table = 'menu_permissions';

    protected $fillable = [
        'menu_id',
        'permission_id',
    ];

    /**
     * Get the associated menu.
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    /**
     * Get the associated permission.
     */
    public function permission()
    {
        return $this->belongsTo(Permission::class, 'permission_id');
    }
}