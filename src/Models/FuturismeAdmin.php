<?php

namespace Aminuddin12\FuturismeAdmin\Models;

// Menggunakan Authenticatable agar bisa login (bukan Model biasa)
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class FuturismeAdmin extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * Nama tabel yang digunakan oleh model ini.
     * Penting karena nama tabel kita bukan plural standar (futurisme_admins).
     *
     * @var string
     */
    protected $table = 'futurisme_admins';

    /**
     * Atribut yang boleh diisi secara massal (Mass Assignment).
     *
     * @var array<int, string>
     */
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

    /**
     * Atribut yang harus disembunyikan saat model dikonversi ke Array/JSON.
     * Penting agar data sensitif tidak bocor ke respon API/Inertia.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Definisi tipe data (Casting).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed', // Otomatis hash password saat set
        'is_active' => 'boolean',
        'is_super_admin' => 'boolean',
        'locked_until' => 'datetime',
        'last_login_at' => 'datetime',

        // Fitur Keamanan: Otomatis encrypt/decrypt data 2FA di database
        'two_factor_secret' => 'encrypted',
        'two_factor_recovery_codes' => 'encrypted',
    ];

    /**
     * Helper untuk mengecek apakah akun sedang terkunci karena brute force.
     */
    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    /**
     * Helper untuk mengecek apakah user aktif.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }
}
