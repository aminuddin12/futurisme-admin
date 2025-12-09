<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuturismeSidebar extends Model
{
    use HasFactory;

    protected $table = 'futurisme_sidebars';

    protected $fillable = [
        'group',
        'title',
        'url',
        'icon',
        'parent_id',
        'order',
        'permission_name',
        'is_active',
        'by_module',
        'add_by',
    ];

    /**
     * Relasi ke child menu (submenu).
     */
    public function children()
    {
        return $this->hasMany(FuturismeSidebar::class, 'parent_id')
                    ->orderBy('order');
    }

    /**
     * Relasi ke parent menu.
     */
    public function parent()
    {
        return $this->belongsTo(FuturismeSidebar::class, 'parent_id');
    }
}