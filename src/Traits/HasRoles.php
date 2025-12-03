<?php

namespace Aminuddin12\FuturismeAdmin\Traits;

use Aminuddin12\FuturismeAdmin\Models\FuturismeRole;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasRoles
{
    public function roles(): MorphToMany
    {
        return $this->morphToMany(
            FuturismeRole::class,
            'model',
            'futurisme_model_has_roles',
            'model_id',
            'role_id'
        );
    }

    public function permissions(): MorphToMany
    {
        return $this->morphToMany(
            FuturismePermission::class,
            'model',
            'futurisme_model_has_permissions',
            'model_id',
            'permission_id'
        );
    }

    // Helper: Cek apakah user punya role tertentu
    public function hasRole($roleName): bool
    {
        return $this->roles->contains('name', $roleName) || $this->is_super_admin;
    }

    // Helper: Cek apakah user punya permission tertentu (via Role atau Direct)
    public function hasPermissionTo($permission): bool
    {
        if ($this->is_super_admin) return true;

        // Cek Direct Permission
        if ($this->permissions->contains('name', $permission)) return true;

        // Cek Permission via Role
        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permission)) return true;
        }

        return false;
    }
}