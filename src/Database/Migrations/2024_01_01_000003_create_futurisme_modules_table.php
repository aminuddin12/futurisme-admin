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
        Schema::create('futurisme_modules', function (Blueprint $table) {
            $table->id();
            
            // Identitas Paket
            $table->string('plugin')->unique(); // Nama unik paket, misal: 'futurisme/ecommerce'
            $table->string('name')->nullable(); // Nama tampilan (Human readable), misal: 'E-Commerce Module'
            $table->string('description')->nullable();
            
            // Versi & Integritas
            $table->string('version'); // Versi terinstall saat ini, misal: '1.0.2'
            $table->string('checksum')->nullable(); // Hash integritas file (opsional tapi berguna untuk keamanan)
            
            // Konfigurasi & Dependensi
            // 'data' menyimpan config JSON spesifik modul agar tidak perlu buat tabel setting baru tiap modul
            $table->json('data')->nullable(); 
            // 'dependencies' menyimpan array JSON modul lain yang dibutuhkan (e.g. ['futurisme/payment'])
            $table->json('dependencies')->nullable(); 
            
            // Status
            $table->string('status')->default('inactive'); // active, inactive, error, maintenance
            $table->boolean('is_core')->default(false); // Penanda jika ini modul inti yang tidak boleh dihapus
            
            // Timestamps & Tracking
            $table->timestamp('installed_at')->useCurrent();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps(); // created_at, updated_at
            
            // Indexing untuk performa query
            $table->index(['plugin', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('futurisme_modules');
    }
};