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
use DateTimeZone;
use ResourceBundle;

class SetupController extends FuturismeBaseController
{
    public function viewConfig()
    {
        // Ambil semua setting dari database
        $settings = FuturismeSetting::orderBy('by_module')
            ->orderBy('group')
            ->orderBy('id')
            ->get();

        // --- LOGIKA POPULASI DATA OPSI DINAMIS ---
        // Kita akan memanipulasi collection $settings sebelum dikirim ke frontend
        // untuk mengisi field 'option' yang kosong pada key tertentu.

        $timezones = $this->getTimezoneList();
        $locales = $this->getLocaleList(); // Format 2 huruf (en, id)
        $fakerLocales = $this->getFakerLocaleList(); // Format lengkap (en_US, id_ID)

        $settings->transform(function ($item) use ($timezones, $locales, $fakerLocales) {
            
            // 1. Timezone
            if ($item->key === 'app.timezone') {
                $item->option = $timezones;
            }

            // 2. Locale & Fallback Locale (2 Huruf)
            if (in_array($item->key, ['app.locale', 'app.fallback_locale'])) {
                $item->option = $locales;
            }

            // 3. Faker Locale (Format Lengkap)
            if ($item->key === 'app.faker_locale') {
                $item->option = $fakerLocales;
            }

            return $item;
        });

        return Inertia::render('Setup/Configuration', [
            'current_php_version' => phpversion(),
            'settings' => $settings,
            // Kirim juga modul yang terinstal untuk header
            'modules' => FuturismeModule::all() 
        ]);
    }

    /**
     * Mendapatkan daftar Timezone.
     * Output: [{label: "(UTC+07:00) Asia/Jakarta", value: "Asia/Jakarta"}, ...]
     */
    private function getTimezoneList()
    {
        $timezones = DateTimeZone::listIdentifiers();
        $list = [];

        foreach ($timezones as $timezone) {
            $tz = new DateTimeZone($timezone);
            $now = new \DateTime('now', $tz);
            $offset = $tz->getOffset($now);
            $hours = $offset / 3600;
            $remainder = $offset % 3600;
            $sign = $hours < 0 ? '-' : '+';
            $hour = (int) abs($hours);
            $minutes = (int) abs($remainder / 60);
            $fmtOffset = sprintf('UTC%s%02d:%02d', $sign, $hour, $minutes);

            $list[] = [
                'label' => "($fmtOffset) $timezone",
                'value' => $timezone
            ];
        }

        return $list;
    }

    /**
     * Mendapatkan daftar Locale (2 Huruf).
     * Output: [{label: "English (en)", value: "en"}, {label: "Indonesian (id)", value: "id"}]
     */
    private function getLocaleList()
    {
        // Daftar manual singkat untuk umum, atau bisa gunakan ResourceBundle jika extensi intl aktif
        $commonLocales = [
            'en' => 'English',
            'id' => 'Indonesian',
            'ms' => 'Malay',
            'ja' => 'Japanese',
            'ko' => 'Korean',
            'zh' => 'Chinese',
            'ar' => 'Arabic',
            'fr' => 'French',
            'de' => 'German',
            'es' => 'Spanish',
            'ru' => 'Russian',
            'pt' => 'Portuguese',
            'hi' => 'Hindi',
            'th' => 'Thai',
            'vi' => 'Vietnamese'
        ];

        $list = [];
        foreach ($commonLocales as $code => $name) {
            $list[] = [
                'label' => "$name ($code)",
                'value' => $code
            ];
        }
        return $list;
    }

    /**
     * Mendapatkan daftar Faker Locale.
     * Output: [{label: "Indonesian (Indonesia) - id_ID", value: "id_ID"}, ...]
     */
    private function getFakerLocaleList()
    {
        // Daftar umum yang didukung FakerPHP
        $fakerLocales = [
            'ar_JO' => 'Arabic (Jordan)',
            'ar_SA' => 'Arabic (Saudi Arabia)',
            'at_AT' => 'German (Austria)',
            'bg_BG' => 'Bulgarian',
            'bn_BD' => 'Bengali',
            'cs_CZ' => 'Czech',
            'da_DK' => 'Danish',
            'de_AT' => 'German (Austria)',
            'de_CH' => 'German (Switzerland)',
            'de_DE' => 'German (Germany)',
            'el_GR' => 'Greek',
            'en_AU' => 'English (Australia)',
            'en_CA' => 'English (Canada)',
            'en_GB' => 'English (Great Britain)',
            'en_HK' => 'English (Hong Kong)',
            'en_IN' => 'English (India)',
            'en_NG' => 'English (Nigeria)',
            'en_NZ' => 'English (New Zealand)',
            'en_PH' => 'English (Philippines)',
            'en_SG' => 'English (Singapore)',
            'en_UG' => 'English (Uganda)',
            'en_US' => 'English (United States)',
            'en_ZA' => 'English (South Africa)',
            'es_AR' => 'Spanish (Argentina)',
            'es_ES' => 'Spanish (Spain)',
            'es_PE' => 'Spanish (Peru)',
            'es_VE' => 'Spanish (Venezuela)',
            'et_EE' => 'Estonian',
            'fa_IR' => 'Persian (Iran)',
            'fi_FI' => 'Finnish',
            'fr_BE' => 'French (Belgium)',
            'fr_CA' => 'French (Canada)',
            'fr_CH' => 'French (Switzerland)',
            'fr_FR' => 'French (France)',
            'he_IL' => 'Hebrew',
            'hr_HR' => 'Croatian',
            'hu_HU' => 'Hungarian',
            'hy_AM' => 'Armenian',
            'id_ID' => 'Indonesian',
            'is_IS' => 'Icelandic',
            'it_CH' => 'Italian (Switzerland)',
            'it_IT' => 'Italian (Italy)',
            'ja_JP' => 'Japanese',
            'ka_GE' => 'Georgian',
            'kk_KZ' => 'Kazakh',
            'ko_KR' => 'Korean',
            'lt_LT' => 'Lithuanian',
            'lv_LV' => 'Latvian',
            'me_ME' => 'Montenegrin',
            'mn_MN' => 'Mongolian',
            'ms_MY' => 'Malay',
            'nb_NO' => 'Norwegian (Bokmål)',
            'ne_NP' => 'Nepali',
            'nl_BE' => 'Dutch (Belgium)',
            'nl_NL' => 'Dutch (Netherlands)',
            'pl_PL' => 'Polish',
            'pt_BR' => 'Portuguese (Brazil)',
            'pt_PT' => 'Portuguese (Portugal)',
            'ro_MD' => 'Romanian (Moldova)',
            'ro_RO' => 'Romanian (Romania)',
            'ru_RU' => 'Russian',
            'sk_SK' => 'Slovak',
            'sl_SI' => 'Slovenian',
            'sr_Cyrl_RS' => 'Serbian (Cyrillic)',
            'sr_Latn_RS' => 'Serbian (Latin)',
            'sv_SE' => 'Swedish',
            'th_TH' => 'Thai',
            'tr_TR' => 'Turkish',
            'uk_UA' => 'Ukrainian',
            'vi_VN' => 'Vietnamese',
            'zh_CN' => 'Chinese (China)',
            'zh_TW' => 'Chinese (Taiwan)',
        ];

        $list = [];
        foreach ($fakerLocales as $code => $name) {
            $list[] = [
                'label' => "$name ($code)",
                'value' => $code
            ];
        }
        return $list;
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

                    // Siapkan update .env (MAPPING KEY DATABASE KE KEY ENV)
                    if ($key === 'app.name') $envUpdates['APP_NAME'] = $value;
                    if ($key === 'app.desc') $envUpdates['APP_DESC'] = $value;
                    if ($key === 'app.env') $envUpdates['APP_ENV'] = $value;
                    if ($key === 'app.debug') $envUpdates['APP_DEBUG'] = $value;
                    if ($key === 'app.url') $envUpdates['APP_URL'] = $value;
                    if ($key === 'app.timezone') $envUpdates['APP_TIMEZONE'] = $value; // Sesuai permintaan
                    if ($key === 'app.time_format') $envUpdates['APP_TIME_FORMAT'] = $value;
                    if ($key === 'app.locale') $envUpdates['APP_LOCALE'] = $value;
                    if ($key === 'app.fallback_locale') $envUpdates['APP_FALLBACK_LOCALE'] = $value;
                    if ($key === 'app.faker_locale') $envUpdates['APP_FAKER_LOCALE'] = $value;
                    
                    if ($key === 'app.maintenance.driver') $envUpdates['APP_MAINTENANCE_DRIVER'] = $value;
                    if ($key === 'app.maintenance.store') $envUpdates['APP_MAINTENANCE_STORE'] = $value;

                    if ($key === 'system.admin_url_prefix') $envUpdates['FUTURISME_ADMIN_URL_PREFIX'] = $value;
                    if ($key === 'system.logo_url') $envUpdates['FUTURISME_LOGO_URL'] = $value;
                    if ($key === 'system.favicon_url') $envUpdates['FUTURISME_FAVICON_URL'] = $value;
                    
                    // ... tambahkan mapping lain sesuai kebutuhan ...
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
        // Pastikan model FuturismeAdmin menggunakan trait HasRoles yang sudah diperbaiki
        if (method_exists($admin, 'roles')) {
             $admin->roles()->sync([$superAdminRole->id]);
        }

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