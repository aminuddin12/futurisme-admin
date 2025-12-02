<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabel Utama Admin
        Schema::create('futurisme_admins', function (Blueprint $table) {
            $table->id();

            // Identitas Dasar
            $table->string('name');
            $table->string('email')->unique();
            $table->string('username')->unique()->nullable(); // Opsi login pakai username
            $table->string('password');
            $table->string('avatar_url')->nullable();

            // Status & Role
            $table->boolean('is_active')->default(true);
            $table->boolean('is_super_admin')->default(false); // Untuk bypass permission check

            // Keamanan Lanjutan (Brute Force Protection & 2FA)
            $table->integer('login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();

            // Audit Trail (Pelacakan)
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); // Agar data tidak hilang permanen jika terhapus
        });

        // Tabel Reset Password Khusus Admin (Terpisah dari User biasa)
        Schema::create('futurisme_password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Tabel Sesi Khusus Admin (Opsional: jika ingin sesi DB terpisah)
        Schema::create('futurisme_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index(); // Akan merujuk ke futurisme_admins
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('futurisme_sessions');
        Schema::dropIfExists('futurisme_password_reset_tokens');
        Schema::dropIfExists('futurisme_admins');
    }
};
