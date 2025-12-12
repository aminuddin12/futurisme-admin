<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;

class FuturismeBaseController extends Controller
{
    public function __construct()
    {
        $this->shareGlobalConfig();
    }

    protected function getSafeConfig()
    {
        $defaultConfig = config('fu-admin');
        $dbSettings = [];

        if (Schema::hasTable('futurisme_settings')) {
            try {
                $settings = FuturismeSetting::all();
                foreach ($settings as $setting) {
                    $dbSettings[$setting->key] = $setting->value;
                }
            } catch (\Exception $e) {
            }
        }

        return [
            'app_name' => $dbSettings['site_name'] ?? $defaultConfig['site_name'] ?? 'Futurisme Admin',
            'logo_url' => $dbSettings['logo_url'] ?? $defaultConfig['logo_url'] ?? null,
            'theme' => [
                'color_primary' => $dbSettings['theme_color_primary'] ?? $defaultConfig['theme']['color_primary'] ?? '#4f46e5',
                'auto_dark_mode' => filter_var($dbSettings['theme_auto_dark_mode'] ?? false, FILTER_VALIDATE_BOOLEAN),
            ],
            'features' => [
                'can_register' => filter_var($dbSettings['auth_can_register'] ?? $defaultConfig['auth']['public_can_register'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'can_reset_password' => filter_var($dbSettings['auth_can_reset_password'] ?? $defaultConfig['auth']['public_can_reset_password'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ]
        ];
    }

    protected function shareGlobalConfig()
    {
        Inertia::share('config', $this->getSafeConfig());
    }
}