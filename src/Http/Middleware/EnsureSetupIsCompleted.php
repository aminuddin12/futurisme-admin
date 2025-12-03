<?php

namespace Aminuddin12\FuturismeAdmin\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Symfony\Component\HttpFoundation\Response;

class EnsureSetupIsCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        // PENTING: Jangan jalankan cek setup pada rute-rute ini untuk mencegah loop
        if ($request->is('fu-settings*') || $request->is('livewire*') || $request->is('api*')) {
            return $next($request);
        }

        // Cek apakah tabel settings ada dan memiliki konfigurasi dasar
        try {
            // Gunakan cache atau session helper jika query ini terlalu berat di setiap request
            $isConfigured = FuturismeSetting::where('key', 'site_name')->exists();
        } catch (\Exception $e) {
            $isConfigured = false;
        }

        // Jika belum setup, redirect ke wizard
        if (! $isConfigured) {
            return redirect()->route('futurisme.setup.config');
        }

        return $next($request);
    }
}