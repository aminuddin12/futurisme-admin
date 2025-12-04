<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;
use Aminuddin12\FuturismeAdmin\Helpers\EnvWriter;
use Illuminate\Support\Facades\Hash;

class SetupController extends FuturismeBaseController
{
    // STEP 1: Halaman Konfigurasi
    public function viewConfig()
    {
        // Ambil daftar modul yang belum dikonfigurasi (data is NULL)
        $pendingModules = FuturismeModule::whereNull('data')->get();

        // PERBAIKAN: Cek value dari setting, bukan hanya eksistensi row
        $siteNameSetting = FuturismeSetting::where('key', 'site_name')->first();
        
        // Cek apakah konfigurasi dasar sudah diisi (value tidak null/empty)
        $basicSettingsConfigured = ($siteNameSetting && !empty($siteNameSetting->value)) || env('FUTURISME_SITE_NAME');
        
        // Jika Config Dasar SUDAH diisi DAN TIDAK ADA modul pending, baru lanjut ke Step 2
        if ($basicSettingsConfigured && $pendingModules->isEmpty()) {
            return redirect()->route('futurisme.setup.admin');
        }

        $settings = \Aminuddin12\FuturismeAdmin\Models\FuturismeSetting::orderBy('by_module')->orderBy('group')->get();

        return Inertia::render('Setup/Configuration', [
            'current_php_version' => phpversion(),
            'pending_modules' => $pendingModules,
            'settings' => $settings,
        ]);
    }

    // STEP 1: Simpan Konfigurasi
    public function storeConfig(Request $request)
    {
        $data = $request->validate([
            'site_name' => 'required|string|max:50',
            'url_prefix' => 'required|alpha_dash|max:20',
            'can_register' => 'boolean',
            'theme_color' => 'required|string',
        ]);

        // 1. Simpan Settings ke Database
        $settings = [
            'site_name' => $data['site_name'],
            'url_prefix' => $data['url_prefix'],
            'auth.can_register' => $data['can_register'],
            'theme.color_scheme' => $data['theme_color'],
        ];

        foreach ($settings as $key => $val) {
            FuturismeSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $val, 'type' => is_bool($val) ? 'boolean' : 'string']
            );
        }

        // 2. Simpan ke .env (Untuk persistensi file)
        try {
            EnvWriter::update([
                'FUTURISME_SITE_NAME' => $data['site_name'],
                'FUTURISME_URL_PREFIX' => $data['url_prefix'],
                'FUTURISME_AUTH_CAN_REGISTER' => $data['can_register'],
                'FUTURISME_THEME_COLOR' => $data['theme_color'],
            ]);
        } catch (\Exception $e) {}

        $coreModule = FuturismeModule::where('plugin', 'aminuddin12/futurisme-admin')->first();
        if ($coreModule) {
            $coreModule->update([
                'data' => [
                    'configured_at' => now()->toDateTimeString(),
                    'settings' => $settings 
                ],
                'activated_at' => now()
            ]);
        }

        // Clear cache config agar prefix route baru terbaca (penting!)
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('route:clear');

        if (FuturismeModule::whereNull('data')->exists()) {
            return redirect()->route('futurisme.setup.config')
                ->with('status', 'Main config saved. Please configure remaining modules.');
        }

        return redirect()->route('futurisme.setup.admin');
    }

    // STEP 2: Halaman Buat Admin
    public function viewAdmin()
    {
        // Jika admin sudah ada, berarti setup selesai -> redirect ke login
        if (FuturismeAdmin::exists()) {
            return redirect()->route('futurisme.login');
        }

        return Inertia::render('Setup/AdminAccount');
    }

    // STEP 2: Simpan Admin
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:futurisme_admins,email',
            'password' => 'required|confirmed|min:8',
        ]);

        FuturismeAdmin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Model akan auto hash (casting)
            'is_super_admin' => true,
            'is_active' => true,
        ]);

        return redirect()->route('futurisme.login')->with('status', 'Setup Complete! Please login.');
    }
}