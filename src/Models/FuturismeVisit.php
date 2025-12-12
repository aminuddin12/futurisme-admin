<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class FuturismeVisit extends Model
{
    protected $table = 'futurisme_visits';
    
    protected $fillable = [
        'session_id',
        'user_id',
        'ip_address',
        'method',
        'url',
        'referer',
        'user_agent',
        'device',
        'platform',
        'browser',
        'location',
        'cookies'
    ];

    protected $casts = [
        'location' => 'array',
        'cookies' => 'array'
    ];

    public function user()
    {
        $userModel = config('auth.providers.users.model');

        if ($userModel && class_exists($userModel)) {
            try {

                $instance = new $userModel;
                $tableName = $instance->getTable();

                if (Schema::hasTable($tableName)) {
                    return $this->belongsTo($userModel, 'id');
                }
            } catch (\Exception $e) {
                // Abaikan error koneksi saat pengecekan schema, lanjut ke fallback
            }
        }

        return $this->belongsTo(FuturismeAdmin::class, 'id');
    }

    public function admin()
    {
        return $this->belongsTo(FuturismeAdmin::class, 'id');
    }
}