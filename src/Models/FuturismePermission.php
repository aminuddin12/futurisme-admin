<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FuturismePermission extends Model
{
    protected $table = 'futurisme_permissions';
    protected $guarded = ['id'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            FuturismeRole::class,
            'futurisme_role_has_permissions',
            'permission_id',
            'role_id'
        );
    }
}