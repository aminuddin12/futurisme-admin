<?php

namespace Aminuddin12\FuturismeAdmin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FuturismeModule extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'futurisme_modules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'plugin',
        'name',
        'description',
        'version',
        'checksum',
        'data',
        'dependencies',
        'status',
        'is_core',
        'installed_at',
        'activated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',          // Otomatis convert JSON ke Array saat diakses
        'dependencies' => 'array',  // Otomatis convert JSON ke Array saat diakses
        'is_core' => 'boolean',
        'installed_at' => 'datetime',
        'activated_at' => 'datetime',
    ];

    /**
     * Scope a query to only include active modules.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Check if the module is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Activate the module.
     */
    public function activate(): bool
    {
        return $this->update([
            'status' => 'active',
            'activated_at' => now(),
        ]);
    }

    /**
     * Deactivate the module.
     * Core modules cannot be deactivated via this method typically, 
     * but we'll keep the logic simple here.
     */
    public function deactivate(): bool
    {
        if ($this->is_core) {
            return false; // Prevent deactivating core modules
        }

        return $this->update([
            'status' => 'inactive',
            'activated_at' => null,
        ]);
    }

    /**
     * Check dependencies availability.
     * Returns true if dependencies list is empty.
     * Real implementation would check against other installed modules.
     */
    public function hasDependencies(): bool
    {
        return !empty($this->dependencies);
    }
}