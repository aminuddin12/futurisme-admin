<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FuturismeRole extends Model
{
    protected $table = 'futurisme_roles';
    protected $guarded = ['id'];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            FuturismePermission::class,
            'futurisme_role_has_permissions',
            'role_id',
            'permission_id'
        );
    }

    public function users(): BelongsToMany
    {
        return $this->morphedByMany(
            FuturismeAdmin::class,
            'model',
            'futurisme_model_has_roles',
            'role_id',
            'model_id'
        );
    }
}