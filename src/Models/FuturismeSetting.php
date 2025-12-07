<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;

class FuturismeSetting extends Model
{
    protected $table = 'futurisme_settings';
    
    protected $fillable = [
        'title',
        'key',
        'option',
        'value',
        'type',
        'group',
        'form_type',
        'is_active',
        'by_module',
        'add_by',
    ];

    protected $casts = [
        'option' => 'array',
    ];
}