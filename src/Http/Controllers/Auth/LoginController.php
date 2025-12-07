<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Auth;

// PENTING: Kita ganti use Controller biasa dengan Base Controller kita
use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

// Ubah extends menjadi FuturismeBaseController
class LoginController extends FuturismeBaseController
{
    /**
     * Tampilkan halaman login admin.
     */
    public function create()
    {
        $canRegister = config('fu-admin.auth.public_can_register', false);
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('futurisme.password.request'),
            'status' => session('status'),
            'canRegister' => $canRegister,
        ]);
    }

    /**
     * Proses login admin.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Gunakan guard 'futurisme' yang sudah didaftarkan di ServiceProvider
        if (! Auth::guard('futurisme')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {

            // Increment login attempts logic bisa ditambahkan di sini (sesuai field migration)

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        // Redirect ke dashboard admin
        return redirect()->intended(route('futurisme.dashboard'));
    }

    /**
     * Proses logout admin.
     */
    public function destroy(Request $request)
    {
        Auth::guard('futurisme')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('futurisme.login');
    }
}