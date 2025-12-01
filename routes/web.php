<?php

use Illuminate\Support\Facades\Route;
use Aminuddin12\FuturismeAdmin\Http\Controllers\Auth\LoginController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Route khusus untuk paket Futurisme Admin.
| Middleware 'web' diterapkan secara otomatis oleh ServiceProvider.
|
*/

// Middleware 'web' memastikan session & CSRF berfungsi
Route::middleware(['web'])->group(function () {

    // Guest Routes (Hanya untuk yang BELUM login sebagai admin)
    Route::middleware('guest:futurisme')->group(function () {
        Route::get('login', [LoginController::class, 'create'])->name('futurisme.login');
        Route::post('login', [LoginController::class, 'store'])->name('futurisme.login.store');

        // Placeholder untuk Lupa Password (jika nanti dibuat)
        Route::get('forgot-password', function() { return 'TODO'; })->name('futurisme.password.request');
    });

    // Authenticated Routes (Hanya untuk yang SUDAH login sebagai admin)
    Route::middleware('auth:futurisme')->group(function () {
        Route::post('logout', [LoginController::class, 'destroy'])->name('futurisme.logout');

        Route::get('/', function () {
            // Mengarahkan ke Dashboard React
            return Inertia::render('Dashboard');
        })->name('futurisme.dashboard');
    });
});
