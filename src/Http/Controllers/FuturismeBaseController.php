<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;

class FuturismeBaseController extends Controller
{
    public function __construct()
    {
        $this->shareGlobalConfig();
        $this->shareSidebarMenu();
    }

    protected function shareGlobalConfig()
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
                // Silent fail
            }
        }

        $mergedConfig = [
            'site_name' => $dbSettings['site_name'] ?? $defaultConfig['site_name'] ?? 'Futurisme Admin',
            'logo_url' => $dbSettings['logo_url'] ?? $defaultConfig['logo_url'] ?? null,
            'admin_url_prefix' => $defaultConfig['admin_url_prefix'] ?? 'admin',
            //'url_prefix' => $defaultConfig['admin_url_prefix'] ?? 'admin',
            
            'auth' => [
                'public_can_register' => filter_var($dbSettings['auth_can_register'] ?? $defaultConfig['auth']['public_can_register'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'public_can_reset_password' => filter_var($dbSettings['auth_can_reset_password'] ?? $defaultConfig['auth']['public_can_reset_password'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ],

            'theme' => [
                'color_primary' => $dbSettings['theme_color_primary'] ?? $defaultConfig['theme']['color_primary'] ?? '#4f46e5',
                'auto_dark_mode' => filter_var($dbSettings['theme_auto_dark_mode'] ?? false, FILTER_VALIDATE_BOOLEAN),
            ],
        ];

        Inertia::share('config', $mergedConfig);
    }

    protected function shareSidebarMenu()
    {
        if (Schema::hasTable('futurisme_sidebars')) {
            try {
                $menus = FuturismeSidebar::with('children')
                    ->whereNull('parent_id')
                    ->where('is_active', true)
                    ->orderBy('order')
                    ->get();

                Inertia::share('menus', $menus);
            } catch (\Exception $e) {
                Inertia::share('menus', []);
            }
        } else {
            Inertia::share('menus', []);
        }
    }
}