<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;
use Aminuddin12\FuturismeAdmin\Helpers\EnvWriter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; // Tambahkan Log untuk debugging

class SetupController extends FuturismeBaseController
{
    public function viewConfig()
    {
        $settings = FuturismeSetting::orderBy('by_module')
            ->orderBy('group')
            ->orderBy('id')
            ->get();

        return Inertia::render('Setup/Configuration', [
            'current_php_version' => phpversion(),
            'settings' => $settings,
        ]);
    }

    public function storeConfig(Request $request)
    {
        // Debugging: Cek apa yang diterima server
        // Log::info('Setup Config Data:', $request->all());

        // Validasi input dasar
        // Hapus validasi file di sini jika ingin menangani per-key di loop
        // Atau gunakan validasi wildcard jika nama input dinamis
        $request->validate([
            // 'logo_url' tidak akan bekerja jika nama inputnya 'logo_url' (underscore) tapi key DB nya beda
            // Kita validasi manual atau biarkan logic di bawah yang handle
        ]);

        $allSettings = FuturismeSetting::all();
        $settingsToSave = [];
        $envUpdates = [];

        foreach ($allSettings as $setting) {
            $key = $setting->key;
            
            // Konversi dot notation ke underscore (perilaku standar PHP untuk input name)
            $inputKey = str_replace('.', '_', $key);
            
            // Cek apakah ada data untuk setting ini di request
            if ($request->has($inputKey) || $request->hasFile($inputKey)) {
                
                $value = null;

                // 1. Handle File Upload
                if ($request->hasFile($inputKey)) {
                    try {
                        $file = $request->file($inputKey);
                        // Validasi manual file
                        if (!$file->isValid()) {
                            continue;
                        }
                        
                        $path = $file->store('futurisme/settings', 'public');
                        $value = Storage::url($path);
                    } catch (\Exception $e) {
                        Log::error("File upload failed for {$key}: " . $e->getMessage());
                        continue; // Skip jika gagal
                    }
                } 
                // 2. Handle Input Biasa
                else {
                    $rawValue = $request->input($inputKey);

                    // Normalisasi Boolean
                    if ($setting->type === 'boolean' || $setting->form_type === 'toggle' || $setting->form_type === 'checkbox') {
                        // String 'true'/'false' (dari JS FormData) -> boolean
                        $value = filter_var($rawValue, FILTER_VALIDATE_BOOLEAN);
                    } else {
                        $value = $rawValue;
                    }
                }

                // Update Database
                $setting->update(['value' => $value]);
                $settingsToSave[$key] = $value;

                // Siapkan update .env
                if ($key === 'site_name') $envUpdates['FUTURISME_SITE_NAME'] = $value;
                if ($key === 'url_prefix') $envUpdates['FUTURISME_URL_PREFIX'] = $value;
            }
        }

        // Update .env
        if (!empty($envUpdates)) {
            try {
                EnvWriter::update($envUpdates);
            } catch (\Exception $e) {
                Log::warning('Failed to update .env file: ' . $e->getMessage());
            }
        }

        // Update Module Snapshot
        try {
            $coreModule = FuturismeModule::where('plugin', 'aminuddin12/futurisme-admin')->first();
            if ($coreModule) {
                $currentData = $coreModule->data ?? [];
                $newData = array_merge($currentData, [
                    'configured_at' => now()->toDateTimeString(),
                    'settings_snapshot' => $settingsToSave
                ]);

                $coreModule->update([
                    'data' => $newData,
                    'activated_at' => now()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to update module status: ' . $e->getMessage());
        }

        // Clear Caches
        try {
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('route:clear');
        } catch (\Exception $e) {}

        return redirect()->route('futurisme.setup.admin');
    }

    public function viewAdmin()
    {
        if (FuturismeAdmin::exists()) {
            return redirect()->route('futurisme.login');
        }
        return Inertia::render('Setup/AdminAccount');
    }

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
            'password' => $request->password,
            'is_super_admin' => true,
            'is_active' => true,
        ]);

        return redirect()->route('futurisme.login')->with('status', 'Setup Complete! Please login.');
    }
}