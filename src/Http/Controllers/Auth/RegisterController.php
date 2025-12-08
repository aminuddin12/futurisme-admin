<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Auth;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisterController extends FuturismeBaseController
{
    /**
     * Tampilkan halaman pendaftaran.
     */
    public function create()
    {
        // Cek config apakah registrasi diizinkan
        if (!config('fu-admin.auth.public_can_register', false)) {
            return redirect()->route('futurisme.login')
                ->with('status', 'Registrasi publik saat ini dinonaktifkan.');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Proses pendaftaran user baru.
     */
    public function store(Request $request)
    {
        // Cek config lagi untuk keamanan ganda
        if (!config('fu-admin.auth.public_can_register', false)) {
            abort(403, 'Registrasi dinonaktifkan.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:futurisme_admins',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = FuturismeAdmin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true, // Default aktif, bisa diubah jika butuh verifikasi email
            'is_super_admin' => false, // Default user biasa
        ]);

        // Login otomatis setelah register
        Auth::guard('futurisme')->login($user);

        return redirect()->route('futurisme.dashboard');
    }
}