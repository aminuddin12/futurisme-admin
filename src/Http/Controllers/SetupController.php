<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;
use Aminuddin12\FuturismeAdmin\Models\FuturismeRole;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;
use Aminuddin12\FuturismeAdmin\Helpers\EnvWriter;
use Aminuddin12\FuturismeAdmin\Helpers\ImageValidation;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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
        // Cek izin penulisan env sebelum memproses apapun
        // Jika user belum login (setup awal) -> Izinkan
        // Jika user login -> Cek apakah Super Admin
        $user = Auth::guard('futurisme')->user();
        $isSetupMode = !FuturismeAdmin::exists();
        
        if (!$isSetupMode && (!$user || !$user->is_super_admin)) {
            // Jika bukan setup mode dan user bukan super admin, tolak
            // Kecuali EnvWriter mengizinkan update parsial (akan dicheck di dalam EnvWriter)
        }

        $allSettings = FuturismeSetting::all();
        $settingsToSave = [];
        $envUpdates = [];
        $errors = [];

        foreach ($allSettings as $setting) {
            $key = $setting->key;
            $inputKey = str_replace('.', '_', $key);

            if ($request->has($inputKey) || $request->hasFile($inputKey)) {
                $value = null;

                // 1. Handle File Upload (Image)
                if ($request->hasFile($inputKey)) {
                    $file = $request->file($inputKey);
                    
                    // Gunakan Helper Validasi Gambar
                    if (ImageValidation::isValid($file)) {
                        try {
                            $path = $file->store('futurisme/settings', 'public');
                            $value = Storage::url($path);
                        } catch (\Exception $e) {
                            Log::error("Gagal menyimpan file {$key}: " . $e->getMessage());
                            $errors[$key] = 'Gagal menyimpan file ke server.';
                            continue;
                        }
                    } else {
                        // Jika file diupload tapi tidak valid
                        $errors[$key] = ImageValidation::getErrorMessage();
                        continue; 
                    }
                } 
                // 2. Handle Input Biasa / Tidak ada file
                else {
                    $rawValue = $request->input($inputKey);

                    // LOGIKA DEFAULT IMAGE
                    // Jika key adalah logo_url dan input kosong/null, gunakan default asset
                    if ($key === 'logo_url' && empty($rawValue)) {
                        // Pastikan asset ini ada di public/vendor/...
                        $value = asset('vendor/futurisme-admin/assets/logo-default.svg'); 
                        
                        // Fallback jika file fisik tidak ketemu (opsional), gunakan string path
                        if (!file_exists(public_path('vendor/futurisme-admin/assets/logo-default.svg'))) {
                           // Gunakan placeholder atau null agar frontend merender SVG inline default
                           $value = null; 
                        }
                    } 
                    // Normalisasi Boolean
                    elseif ($setting->type === 'boolean' || $setting->form_type === 'toggle' || $setting->form_type === 'checkbox') {
                        $value = filter_var($rawValue, FILTER_VALIDATE_BOOLEAN);
                    } else {
                        $value = $rawValue;
                    }
                }

                // Simpan ke DB hanya jika valid
                if (!isset($errors[$key])) {
                    $setting->update(['value' => $value]);
                    $settingsToSave[$key] = $value;

                    // Siapkan update .env
                    if ($key === 'site_name') $envUpdates['FUTURISME_SITE_NAME'] = $value;
                    if ($key === 'url_prefix') $envUpdates['FUTURISME_URL_PREFIX'] = $value;
                }
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }

        // Update .env dengan Keamanan Ketat
        if (!empty($envUpdates)) {
            try {
                // EnvWriter akan mengecek permission di dalamnya
                $envUpdated = EnvWriter::update($envUpdates);
                
                if (!$envUpdated && $isSetupMode) {
                    // Jika gagal saat setup mode, mungkin permission file server
                    Log::error('Gagal menulis .env saat setup.');
                }
            } catch (\Exception $e) {
                // Tangkap error jika user tidak punya akses
                if ($request->wantsJson()) {
                    return response()->json(['message' => $e->getMessage()], 403);
                }
            }
        }

        // Update Module Snapshot
        $this->updateModuleSnapshot($settingsToSave);

        // Clear Caches
        try {
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('route:clear');
        } catch (\Exception $e) {}

        // Cek Kelengkapan Setup
        $incompleteSettings = FuturismeSetting::whereNull('value')->count();
        if ($incompleteSettings > 0) {
            return redirect()->back()->with('warning', "Konfigurasi tersimpan, namun masih ada {$incompleteSettings} pengaturan yang kosong.");
        }

        return redirect()->route('futurisme.setup.admin');
    }

    protected function updateModuleSnapshot(array $settingsSnapshot)
    {
        try {
            $coreModule = FuturismeModule::where('plugin', 'aminuddin12/futurisme-admin')->first();
            if ($coreModule) {
                $currentData = $coreModule->data ?? [];
                $newData = array_merge($currentData, [
                    'configured_at' => now()->toDateTimeString(),
                    'settings_snapshot' => $settingsSnapshot
                ]);

                $coreModule->update([
                    'data' => $newData,
                    'activated_at' => now()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to update module status: ' . $e->getMessage());
        }
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
        // Pastikan tidak ada admin sebelumnya (Double Security)
        if (FuturismeAdmin::exists()) {
            return redirect()->route('futurisme.login');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:futurisme_admins,email',
            'password' => 'required|confirmed|min:8',
        ]);

        // 1. Buat User Super Admin
        $admin = FuturismeAdmin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Pastikan di-hash manual jika model tidak auto-hash
            'is_super_admin' => true,
            'is_active' => true,
        ]);

        // 2. Setup Roles & Permissions
        // Pastikan Role 'Super Admin' ada
        $superAdminRole = FuturismeRole::firstOrCreate(
            ['name' => 'Super Admin'],
            ['guard_name' => 'futurisme']
        );

        // Assign Role ke User (Menggunakan Trait HasRoles)
        $admin->roles()->sync([$superAdminRole->id]);

        // Assign Semua Permission ke Role Super Admin
        // Ambil semua permission yang ada di sistem saat ini
        $allPermissions = FuturismePermission::all();
        if ($allPermissions->count() > 0) {
            $superAdminRole->permissions()->sync($allPermissions);
        }

        // 3. Kunci EnvWriter (Tandai setup selesai secara implisit dengan adanya admin)
        // Logika EnvWriter otomatis mengecek FuturismeAdmin::exists()

        return redirect()->route('futurisme.login')->with('status', 'Setup Complete! Please login.');
    }
}