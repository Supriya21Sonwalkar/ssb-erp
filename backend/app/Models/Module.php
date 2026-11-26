<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'module_name',
        'module_slug',
        'module_icon',
        'description',
        'display_order',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    /**
     * Get top-level menus belonging to this module.
     */
    public function menus()
    {
        return $this->hasMany(Menu::class, 'module_id')
            ->whereNull('parent_id')
            ->orderBy('display_order');
    }

    /**
     * Get all menus belonging to this module,
     * including child menus.
     */
    public function allMenus()
    {
        return $this->hasMany(Menu::class, 'module_id')
            ->orderBy('display_order');
    }
}