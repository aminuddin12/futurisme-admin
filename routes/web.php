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
use Aminuddin12\FuturismeAdmin\Http\Controllers\Admin\SystemLogController;
use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeTrackerController;
use Aminuddin12\FuturismeAdmin\Http\Middleware\HandleInertiaRequests;
use Inertia\Inertia;

$adminPrefix = config('fu-admin.admin_url_prefix', 'admin');


Route::middleware(['web', HandleInertiaRequests::class])->group(function () use ($adminPrefix) {
    Route::post('/futurisme/track', [FuturismeTrackerController::class, 'store'])->name('futurisme.tracker.store');

    Route::middleware(['web', 'futurisme.setup_check'])->group(function () {
        Route::get('/fu-settings', [SetupController::class, 'viewConfig'])->name('futurisme.setup.config');
        Route::post('/fu-settings/save', [SetupController::class, 'storeConfig'])->name('futurisme.setup.config.store');
        
        Route::get('/fu-settings/admin', [SetupController::class, 'viewAdmin'])->name('futurisme.setup.admin');
        Route::post('/fu-settings/admin/save', [SetupController::class, 'storeAdmin'])->name('futurisme.setup.admin.store');
    });

    Route::middleware(['futurisme.setup_check'])->prefix($adminPrefix)->group(function () {
        
        Route::middleware('guest:futurisme')->group(function () {
            Route::get('login', [LoginController::class, 'create'])->name('futurisme.login');
            Route::post('login', [LoginController::class, 'store'])->name('futurisme.login.store');
            
            Route::get('register', [RegisterController::class, 'create'])->name('futurisme.register');
            Route::post('register', [RegisterController::class, 'store'])->name('futurisme.register.store');

            Route::get('forgot-password', [ForgotPasswordController::class, 'create'])->name('futurisme.password.request');
            Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('futurisme.password.email');
        });

        Route::middleware('futurisme.auth:futurisme')->group(function () {
            Route::post('logout', [LoginController::class, 'destroy'])->name('futurisme.logout');

            Route::get('/dashboard', [DashboardController::class, 'index'])->name('futurisme.dashboard');
            
            Route::get('/roles', [RoleController::class, 'index'])->name('futurisme.roles.index');
            Route::post('/roles', [RoleController::class, 'store'])->name('futurisme.roles.store');
            Route::put('/roles/{id}', [RoleController::class, 'update'])->name('futurisme.roles.update');
            Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->name('futurisme.roles.destroy');

            Route::get('/settings', [SettingsController::class, 'index'])->name('futurisme.settings.index');
            Route::put('/settings', [SettingsController::class, 'update'])->name('futurisme.settings.update');

            Route::get('/sidebar', [SidebarController::class, 'index'])->name('futurisme.sidebar.index');
            Route::post('/sidebar', [SidebarController::class, 'store'])->name('futurisme.sidebar.store');
            Route::put('/sidebar/{id}', [SidebarController::class, 'update'])->name('futurisme.sidebar.update');
            Route::delete('/sidebar/{id}', [SidebarController::class, 'destroy'])->name('futurisme.sidebar.destroy');
            Route::post('/sidebar/reorder', [SidebarController::class, 'reorder'])->name('futurisme.sidebar.reorder');

            Route::get('/system-logs', [SystemLogController::class, 'index'])->name('futurisme.logs.index');
            Route::delete('/system-logs/clear', [SystemLogController::class, 'destroy'])->name('futurisme.logs.clear');
        });
    });
});