<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;

class FuturismeSetting extends Model
{
    protected $table = 'futurisme_settings';
    
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'form_type',
        'by_module',
    ];
}