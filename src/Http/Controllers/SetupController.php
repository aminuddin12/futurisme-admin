<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Helpers\EnvWriter;
use Illuminate\Support\Facades\Hash;

class SetupController extends FuturismeBaseController
{
    // STEP 1: Halaman Konfigurasi
    public function viewConfig()
    {
        // Jika config sudah ada, langsung lempar ke step 2 (Create Admin)
        if (FuturismeSetting::where('key', 'site_name')->exists() || env('FUTURISME_SITE_NAME')) {
            return redirect()->route('futurisme.setup.admin');
        }

        return Inertia::render('Setup/Configuration', [
            'current_php_version' => phpversion(),
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

        // 1. Simpan ke Database (Prioritas Utama untuk runtime)
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
        } catch (\Exception $e) {
            // Silent fail jika permission denied, karena sudah tersimpan di DB
        }

        // Clear cache config agar prefix route baru terbaca (penting!)
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('route:clear');

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