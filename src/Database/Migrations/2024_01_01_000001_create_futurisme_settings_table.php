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
            $table->string('title')->nullable(); 
            $table->string('key')->unique();
            $table->json('option')->nullable(); 
            $table->text('value')->nullable(); 
            $table->string('type')->default('string'); 
            $table->string('group')->default('general'); 
            $table->string('form_type')->default('text');
            $table->integer('is_active')->default(1)->comment('1: default (update only), 2: full (full access), 3: disabled (readonly)');
            $table->string('by_module')->nullable()->index();
            $table->string('add_by')->default('system'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('futurisme_settings');
    }
};