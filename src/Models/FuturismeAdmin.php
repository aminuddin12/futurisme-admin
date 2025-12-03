<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Aminuddin12\FuturismeAdmin\Traits\HasRoles; // Import Trait

class FuturismeAdmin extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles; // Gunakan Trait

    protected $table = 'futurisme_admins';

    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'avatar_url',
        'is_active',
        'is_super_admin',
        'login_attempts',
        'locked_until',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'password' => 'hashed',
        'is_active' => 'boolean',
        'is_super_admin' => 'boolean',
        'locked_until' => 'datetime',
        'last_login_at' => 'datetime',
        'two_factor_secret' => 'encrypted',
        'two_factor_recovery_codes' => 'encrypted',
    ];

    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }
}