<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('futurisme_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();   // Contoh: 'site_name', 'auth.can_register'
            $table->text('value')->nullable(); // Disimpan bisa dalam bentuk string atau JSON
            $table->string('type')->default('string'); // string, boolean, json, integer
            $table->string('group')->default('general'); // Untuk pengelompokan di UI
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('futurisme_settings');
    }
};