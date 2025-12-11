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
        // Table for Roles
        Schema::create('futurisme_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name')->default('web');
            $table->string('add_by')->default('system');
            $table->timestamps();
        });

        // Table for Permissions
        Schema::create('futurisme_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name')->default('web');
            $table->string('add_by')->default('system');
            $table->timestamps();
        });

        // Pivot Table: Role has Permissions
        Schema::create('futurisme_role_has_permissions', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained('futurisme_permissions')->onDelete('cascade');
            $table->foreignId('role_id')->constrained('futurisme_roles')->onDelete('cascade');
            $table->primary(['permission_id', 'role_id']);
        });

        // Pivot Table: Admin has Roles
        Schema::create('futurisme_model_has_roles', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('futurisme_roles')->onDelete('cascade');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->index(['model_id', 'model_type']);
            $table->primary(['role_id', 'model_id', 'model_type']);
        });

        // Pivot Table: Admin has Permissions (Directly)
        Schema::create('futurisme_model_has_permissions', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained('futurisme_permissions')->onDelete('cascade');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->index(['model_id', 'model_type']);
            $table->primary(['permission_id', 'model_id', 'model_type']);
        });

        // Table for Sidebar Menus (Dynamic Sidebar)
        Schema::create('futurisme_sidebars', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('general');
            $table->string('title');
            $table->string('url')->nullable();
            $table->string('route')->nullable();
            $table->string('icon')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('futurisme_sidebars')->onDelete('cascade');
            $table->integer('order')->default(0);
            $table->string('permission_name')->nullable();
            $table->integer('is_active')->default(1);
            $table->string('by_module')->nullable()->index();
            $table->string('add_by')->default('system');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('futurisme_sidebars');
        Schema::dropIfExists('futurisme_model_has_permissions');
        Schema::dropIfExists('futurisme_model_has_roles');
        Schema::dropIfExists('futurisme_role_has_permissions');
        Schema::dropIfExists('futurisme_permissions');
        Schema::dropIfExists('futurisme_roles');
    }
};