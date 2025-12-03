<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Auth;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ForgotPasswordController extends FuturismeBaseController
{
    /**
     * Tampilkan halaman lupa password.
     */
    public function create()
    {
        // Ambil konfigurasi apakah registrasi diizinkan
        $canRegister = config('fu-admin.auth.can_register', false);

        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'canRegister' => $canRegister,
        ])->rootView('futurisme::app');
    }

    /**
     * Handle pengiriman link reset password (TODO: Implementasi logika kirim email).
     */
    public function store(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Logika pengiriman email reset password akan ditambahkan di sini.
        // Untuk saat ini kita hanya simulasi sukses.

        return back()->with('status', 'Kami telah mengirimkan tautan reset password ke email Anda.');
    }
}