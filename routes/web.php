<?php

use Illuminate\Support\Facades\Route;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Auth\LoginController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Ambil prefix dari config, default 'admin'
$adminPrefix = config('fu-admin.url_prefix', 'admin');

Route::middleware(['web'])->prefix($adminPrefix)->group(function () {

    // Guest Routes (Hanya untuk yang BELUM login)
    Route::middleware('guest:futurisme')->group(function () {
        Route::get('login', [LoginController::class, 'create'])->name('futurisme.login');
        Route::post('login', [LoginController::class, 'store'])->name('futurisme.login.store');

        // Pastikan route ini ada dan namanya benar
        Route::get('forgot-password', function() { 
            return 'Fitur Lupa Password (TODO)'; 
        })->name('futurisme.password.request');
    });

    // Authenticated Routes (Hanya untuk yang SUDAH login)
    Route::middleware('futurisme.auth:futurisme')->group(function () {
        Route::post('logout', [LoginController::class, 'destroy'])->name('futurisme.logout');

        Route::get('/', function () {
            return Inertia::render('Dashboard')->rootView('futurisme::app');
        })->name('futurisme.dashboard');
    });
});