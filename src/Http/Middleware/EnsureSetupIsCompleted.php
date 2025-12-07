<?php

namespace Aminuddin12\FuturismeAdmin\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Schema;

class EnsureSetupIsCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        // Bypass untuk rute setup dan asset
        if ($request->is('fu-settings*') || $request->is('livewire*') || $request->is('api*')) {
            return $next($request);
        }

        // 1. Cek Konfigurasi Dasar (Site Name)
        try {
            $setting = FuturismeSetting::where('key', 'app_name')->first();
            $isConfigured = ($setting && !empty($setting->value)) || env('APP_NAME');
            
        } catch (\Exception $e) {
            $isConfigured = false;
        }

        // 2. Cek Apakah ada Modul yang "Pending" (kolom data masih NULL)
        $hasPendingModules = false;
        try {
            if (Schema::hasTable('futurisme_modules')) {
                $hasPendingModules = FuturismeModule::whereNull('data')->exists();
            }
        } catch (\Exception $e) {
            // Silent fail
        }

        // Jika belum dikonfigurasi ATAU ada modul baru yang belum disetup
        if (! $isConfigured || $hasPendingModules) {
            return redirect()->route('futurisme.setup.config');
        }

        return $next($request);
    }
}