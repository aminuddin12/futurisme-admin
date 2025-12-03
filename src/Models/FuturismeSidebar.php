<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;

class FuturismeSidebar extends Model
{
    protected $table = 'futurisme_sidebars';
    protected $guarded = ['id'];

    public function children()
    {
        return $this->hasMany(FuturismeSidebar::class, 'parent_id')->orderBy('order');
    }

    public function parent()
    {
        return $this->belongsTo(FuturismeSidebar::class, 'parent_id');
    }
}