<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Roles
        Schema::create('futurisme_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');       // Nama Role (contoh: 'super-admin', 'editor')
            $table->string('guard_name')->default('futurisme'); // Guard (default: futurisme)
            $table->timestamps();
        });

        // 2. Tabel Permissions
        Schema::create('futurisme_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');       // Nama Permission (contoh: 'edit articles')
            $table->string('guard_name')->default('futurisme');
            $table->timestamps();
        });

        // 3. Pivot: Model (Admin) punya Roles
        Schema::create('futurisme_model_has_roles', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('futurisme_roles')->onDelete('cascade');
            $table->string('model_type'); // Class name model (e.g. FuturismeAdmin)
            $table->unsignedBigInteger('model_id'); // ID user
            $table->index(['model_id', 'model_type']);
            $table->primary(['role_id', 'model_id', 'model_type']);
        });

        // 4. Pivot: Role punya Permissions
        Schema::create('futurisme_role_has_permissions', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained('futurisme_permissions')->onDelete('cascade');
            $table->foreignId('role_id')->constrained('futurisme_roles')->onDelete('cascade');
            $table->primary(['permission_id', 'role_id']);
        });

        // 5. Pivot: Model (Admin) punya Direct Permissions (Opsional tapi berguna)
        Schema::create('futurisme_model_has_permissions', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained('futurisme_permissions')->onDelete('cascade');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->index(['model_id', 'model_type']);
            $table->primary(['permission_id', 'model_id', 'model_type']);
        });

        // 6. Tabel Sidebar (Menu Management)
        Schema::create('futurisme_sidebars', function (Blueprint $table) {
            $table->id();
            $table->string('title');          // Judul Menu
            $table->string('url')->nullable(); // URL/Route Name
            $table->string('icon')->nullable(); // Icon Class (e.g. Heroicons/Iconify)
            $table->foreignId('parent_id')->nullable()->constrained('futurisme_sidebars')->onDelete('cascade'); // Untuk Submenu
            $table->integer('order')->default(0); // Urutan
            $table->string('permission_name')->nullable(); // Permission yang dibutuhkan untuk melihat menu ini
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('futurisme_sidebars');
        Schema::dropIfExists('futurisme_model_has_permissions');
        Schema::dropIfExists('futurisme_role_has_permissions');
        Schema::dropIfExists('futurisme_model_has_roles');
        Schema::dropIfExists('futurisme_permissions');
        Schema::dropIfExists('futurisme_roles');
    }
};