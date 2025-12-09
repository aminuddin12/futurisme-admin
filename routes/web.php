<?php

use Illuminate\Support\Facades\Route;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Auth\LoginController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Auth\RegisterController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Auth\ForgotPasswordController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\SetupController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Admin\DashboardController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Admin\RoleController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Admin\SettingsController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Admin\SidebarController;
use Aminuddin12\FuturismeAdmin\Http\Middleware\EnsureSetupIsNotCompleted;
use Aminuddin12\FuturismeAdmin\Http\Middleware\HandleInertiaRequests;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

$adminPrefix = config('fu-admin.admin_url_prefix', 'admin');

// 1. Group Utama: Web + Inertia Shared Data
Route::middleware(['web', HandleInertiaRequests::class])->group(function () use ($adminPrefix) {

    // ---------------------------------------------------------------------
    // A. SETUP WIZARD (Public Access, tapi diblokir jika setup selesai)
    // ---------------------------------------------------------------------
    Route::middleware(['web', 'futurisme.setup_check'])->group(function () {
        Route::get('/fu-settings', [SetupController::class, 'viewConfig'])->name('futurisme.setup.config');
        Route::post('/fu-settings/save', [SetupController::class, 'storeConfig'])->name('futurisme.setup.config.store');
        
        Route::get('/fu-settings/admin', [SetupController::class, 'viewAdmin'])->name('futurisme.setup.admin');
        Route::post('/fu-settings/admin/save', [SetupController::class, 'storeAdmin'])->name('futurisme.setup.admin.store');
    });

    // ---------------------------------------------------------------------
    // B. MAIN ADMIN ROUTES (Butuh Setup Selesai)
    // ---------------------------------------------------------------------
    Route::middleware(['futurisme.setup_check'])->prefix($adminPrefix)->group(function () {
        
        // 1. Guest Routes (Login, Register, Forgot Password)
        Route::middleware('guest:futurisme')->group(function () {
            Route::get('login', [LoginController::class, 'create'])->name('futurisme.login');
            Route::post('login', [LoginController::class, 'store'])->name('futurisme.login.store');
            
            Route::get('register', [RegisterController::class, 'create'])->name('futurisme.register');
            Route::post('register', [RegisterController::class, 'store'])->name('futurisme.register.store');

            Route::get('forgot-password', [ForgotPasswordController::class, 'create'])->name('futurisme.password.request');
            Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('futurisme.password.email');
        });

        // 2. Authenticated Routes (Dashboard, Logout, & Management)
        Route::middleware('futurisme.auth:futurisme')->group(function () {
            Route::post('logout', [LoginController::class, 'destroy'])->name('futurisme.logout');

            // Dashboard Route menggunakan Controller
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('futurisme.dashboard');
            // Roles & Permissions
            Route::get('/roles', [RoleController::class, 'index'])->name('futurisme.roles.index');
            Route::post('/roles', [RoleController::class, 'store'])->name('futurisme.roles.store');
            Route::put('/roles/{id}', [RoleController::class, 'update'])->name('futurisme.roles.update');
            Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->name('futurisme.roles.destroy');
            // ... (permission routes) ...

            // SETTINGS ROUTES (BARU)
            Route::get('/settings', [SettingsController::class, 'index'])->name('futurisme.settings.index');
            Route::put('/settings', [SettingsController::class, 'update'])->name('futurisme.settings.update');
            });
    });
});