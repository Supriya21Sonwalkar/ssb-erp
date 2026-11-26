<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
        'module_id',
        'parent_id',
        'menu_name',
        'menu_slug',
        'route',
        'icon',
        'display_order',
        'is_clickable',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_clickable' => 'boolean',
    ];

    /**
     * Get the module to which this menu belongs.
     */
    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    /**
     * Get the parent menu.
     */
    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    /**
     * Get child menus.
     */
    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')
            ->orderBy('display_order');
    }

    /**
     * Get permissions associated with this menu.
     */
    public function menuPermissions()
    {
        return $this->hasMany(MenuPermission::class, 'menu_id');
    }

    /**
     * Get permission records associated with this menu.
     */
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'menu_permissions',
            'menu_id',
            'permission_id'
        )->withTimestamps();
    }
}