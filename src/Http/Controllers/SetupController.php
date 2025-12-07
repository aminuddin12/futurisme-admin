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
        $unconfiguredModules = FuturismeModule::whereNull('data')->get();

        if ($unconfiguredModules->isEmpty()) {
            return redirect()->route('futurisme.setup.admin')
                ->with('status', 'Anda Sudah mengisi semua data konfigurasi, Sekarang ke tahap membuat akun admin');
        }

        $settings = FuturismeSetting::orderBy('by_module')
            ->orderBy('group')
            ->orderBy('id')
            ->get();

        $timezones = $this->getTimezoneList();
        $locales = $this->getLocaleList();
        $fakerLocales = $this->getFakerLocaleList();

        $settings->transform(function ($item) use ($timezones, $locales, $fakerLocales) {
            if ($item->key === 'app.timezone') {
                $item->option = $timezones;
            }
            if (in_array($item->key, ['app.locale', 'app.fallback_locale'])) {
                $item->option = $locales;
            }
            if ($item->key === 'app.faker_locale') {
                $item->option = $fakerLocales;
            }
            return $item;
        });

        $modules = FuturismeModule::all()->map(function($mod) {
            $mod->is_configured = !is_null($mod->data);
            return $mod;
        });

        return Inertia::render('Setup/Configuration', [
            'current_php_version' => phpversion(),
            'settings' => $settings,
            'modules' => $modules,
            'pending_modules' => $unconfiguredModules->pluck('name') 
        ]);
    }

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

    private function getLocaleList()
    {
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

    private function getFakerLocaleList()
    {
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
        $user = Auth::guard('futurisme')->user();
        $isSetupMode = !FuturismeAdmin::exists();
        
        if (!$isSetupMode && (!$user || !$user->is_super_admin)) {
            // Logic handled by EnvWriter check or Middleware
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

                if ($request->hasFile($inputKey)) {
                    $file = $request->file($inputKey);
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
                        $errors[$key] = ImageValidation::getErrorMessage();
                        continue; 
                    }
                } else {
                    $rawValue = $request->input($inputKey);
                    if ($key === 'system.logo_url' && empty($rawValue)) {
                        $value = asset('vendor/futurisme-admin/assets/logo-default.svg'); 
                        if (!file_exists(public_path('vendor/futurisme-admin/assets/logo-default.svg'))) {
                           $value = null; 
                        }
                    } elseif ($setting->type === 'boolean' || $setting->form_type === 'toggle' || $setting->form_type === 'checkbox') {
                        $value = filter_var($rawValue, FILTER_VALIDATE_BOOLEAN);
                    } else {
                        $value = $rawValue;
                    }
                }

                if (!isset($errors[$key])) {
                    // Validasi Mandatory Fields
                    if ($key === 'app.name' && empty($value)) {
                        $errors[$inputKey] = 'Application Name is required.';
                    }
                    if ($key === 'app.url') {
                        $isProduction = $request->input('app_env') === 'production';
                        $isHttps = str_starts_with($value ?? '', 'https://');
                        if (($isProduction || $isHttps) && empty($value)) {
                            $errors[$inputKey] = 'Application URL is required for Production or HTTPS.';
                        }
                    }
                    if ($key === 'app.locale' && empty($value)) {
                        $errors[$inputKey] = 'Locale is required.';
                    }
                    if ($key === 'system.admin_url_prefix' && empty($value)) {
                        $errors[$inputKey] = 'Admin URL Prefix is required.';
                    }
                    if ($key === 'theme.layout_mode' && empty($value)) {
                        $errors[$inputKey] = 'Layout Mode is required.';
                    }
                    if ($key === 'theme.profile_button_position' && empty($value)) {
                        $errors[$inputKey] = 'Profile Button Position is required.';
                    }

                    if (empty($errors[$inputKey])) {
                        $settingsToSave[$key] = $value;

                        // Check Env Value Changes
                        $envKeyMap = [
                            'app.name' => 'APP_NAME',
                            'app.desc' => 'APP_DESC',
                            'app.env' => 'APP_ENV',
                            'app.debug' => 'APP_DEBUG',
                            'app.url' => 'APP_URL',
                            'app.timezone' => 'APP_TIMEZONE',
                            'app.time_format' => 'APP_TIME_FORMAT',
                            'app.locale' => 'APP_LOCALE',
                            'app.fallback_locale' => 'APP_FALLBACK_LOCALE',
                            'app.faker_locale' => 'APP_FAKER_LOCALE',
                            'app.maintenance.driver' => 'APP_MAINTENANCE_DRIVER',
                            'app.maintenance.store' => 'APP_MAINTENANCE_STORE',
                            'system.admin_url_prefix' => 'FUTURISME_ADMIN_URL_PREFIX',
                            'system.logo_url' => 'FUTURISME_LOGO_URL',
                            'system.favicon_url' => 'FUTURISME_FAVICON_URL',
                            'system.enable_backup.by_days' => 'FUTURISME_BACKUP_DAY',
                            'system.enable_backup.by_month' => 'FUTURISME_BACKUP_MONTH',
                            'system.max_file_upload' => 'FUTURISME_MAX_FILE_UPLOAD',
                            'auth.admin_can_create_user' => 'FUTURISME_AUTH_CAN_CREATE_USER',
                            'auth.public_can_register' => 'FUTURISME_PUBLIC_CAN_REGISTER',
                            'auth.public_can_reset_password' => 'FUTURISME_PUBLIC_CAN_RESET_PASSWORD',
                            'auth.public_can_verify_account' => 'FUTURISME_PUBLIC_CAN_VERIFY_ACCOUNT',
                            'auth.can_view_log' => 'FUTURISME_AUTH_CAN_VIEW_LOG',
                            'theme.auto_dark_mode' => 'FUTURISME_THEME_DARK_MODE',
                            'theme.color_primary' => 'FUTURISME_PRIMARY_COLOR',
                            'theme.color_secondary' => 'FUTURISME_SECONDARY_COLOR',
                            'theme.layout_mode' => 'FUTURISME_LAYOUT_MODE',
                            'social.github' => 'FUTURISME_SOCIAL_GITHUB',
                            'social.instagram' => 'FUTURISME_SOCIAL_INSTAGRAM',
                        ];

                        if (isset($envKeyMap[$key])) {
                            $envKey = $envKeyMap[$key];
                            $currentEnvValue = env($envKey);
                            
                            // Bandingkan value dengan env (perhatikan tipe data string/bool)
                            $normalizedValue = is_bool($value) ? ($value ? 'true' : 'false') : (string)$value;
                            $normalizedEnv = is_bool($currentEnvValue) ? ($currentEnvValue ? 'true' : 'false') : (string)$currentEnvValue;

                            if ($normalizedValue !== $normalizedEnv) {
                                $envUpdates[$envKey] = $value;
                            }
                        }
                        
                        // Update Database if changed
                        if ($setting->value != $value) {
                            $setting->update(['value' => $value]);
                        }
                    }
                }
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }

        if (!empty($envUpdates)) {
            try {
                $envUpdated = EnvWriter::update($envUpdates);
                if (!$envUpdated && $isSetupMode) {
                    Log::error('Gagal menulis .env saat setup.');
                }
            } catch (\Exception $e) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => $e->getMessage()], 403);
                }
            }
        }

        $this->updateModuleSnapshot($settingsToSave);

        try {
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('route:clear');
        } catch (\Exception $e) {}

        // Cek lagi apakah masih ada modul yang belum dikonfigurasi setelah penyimpanan
        // Jika semua modul terisi, bisa langsung redirect ke admin
        $unconfiguredModules = FuturismeModule::whereNull('data')->get();
        if ($unconfiguredModules->isEmpty()) {
             return redirect()->route('futurisme.setup.admin')
                ->with('status', 'Konfigurasi modul lengkap. Silakan buat akun admin.');
        }

        // Jika masih ada setting umum yang kosong (fallback)
        $incompleteSettings = FuturismeSetting::whereNull('value')->count();
        if ($incompleteSettings > 0) {
            return redirect()->back()->with('warning', "Konfigurasi tersimpan, namun masih ada {$incompleteSettings} pengaturan yang kosong.");
        }

        // Default: Refresh halaman ini atau ke modul berikutnya (jika frontend handle tab)
        return redirect()->back()->with('success', 'Konfigurasi modul berhasil disimpan.');
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
        if (FuturismeAdmin::exists()) {
            return redirect()->route('futurisme.login');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:futurisme_admins,email',
            'password' => 'required|confirmed|min:8',
        ]);

        $admin = FuturismeAdmin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'is_super_admin' => true,
            'is_active' => true,
        ]);

        $superAdminRole = FuturismeRole::firstOrCreate(
            ['name' => 'Super Admin'],
            ['guard_name' => 'futurisme']
        );

        if (method_exists($admin, 'roles')) {
             $admin->roles()->sync([$superAdminRole->id]);
        }

        $allPermissions = FuturismePermission::all();
        if ($allPermissions->count() > 0) {
            $superAdminRole->permissions()->sync($allPermissions);
        }

        return redirect()->route('futurisme.login')->with('status', 'Setup Complete! Please login.');
    }
}