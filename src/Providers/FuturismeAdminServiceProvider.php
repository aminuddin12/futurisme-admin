<?php

namespace Aminuddin12\FuturismeAdmin\Providers;

use Illuminate\Support\ServiceProvider;
use Aminuddin12\FuturismeAdmin\Console\Commands\InstallFuturismeAdmin;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Illuminate\Routing\Router; // Tambahkan ini
use Aminuddin12\FuturismeAdmin\Http\Middleware\Authenticate; // Tambahkan ini

class FuturismeAdminServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $packageRoot = __DIR__.'/../../';

        // 1. Load Routes
        $this->loadRoutesFrom($packageRoot.'routes/web.php');

        // 2. Load Views
        $this->loadViewsFrom($packageRoot.'src/Resources/views', 'futurisme');

        // 3. Load Migrations
        $this->loadMigrationsFrom($packageRoot.'src/Database/Migrations');

        // 4. Konfigurasi Auth
        $this->configureAuth();

        // 5. Register Middleware Alias (BARU)
        // Ini mendaftarkan middleware 'futurisme.auth' yang kita buat
        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('futurisme.auth', \Aminuddin12\FuturismeAdmin\Http\Middleware\Authenticate::class);

        // 6. Register Command & Publishing
        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallFuturismeAdmin::class,
            ]);

            // Publishes... (sama seperti sebelumnya)
            $this->publishes([
                $packageRoot.'src/Config/fu-admin.php' => config_path('fu-admin.php'),
            ], 'futurisme-config');

            $this->publishes([
                $packageRoot.'src/Resources/views' => resource_path('views/vendor/futurisme'),
            ], 'futurisme-views');

            $this->publishes([
                $packageRoot.'public/vendor/futurisme-admin' => public_path('vendor/futurisme-admin'),
            ], 'futurisme-assets');
        }

        // 7. Konfigurasi Dinamis
        $this->configureDynamicSettings();
    }

    // ... method lainnya (configureDynamicSettings, flattenArray, configureAuth, register) ...
    // Pastikan method lain tetap ada, saya hanya fokus ke boot() di sini.
    
    protected function configureDynamicSettings()
    {
        $defaultConfig = Config::get('fu-admin', []);
        $flattened = $this->flattenArray($defaultConfig);

        foreach ($flattened as $key => $defaultValue) {
            $envKey = 'FUTURISME_' . strtoupper(str_replace('.', '_', $key));
            $envValue = env($envKey);

            if ($envValue !== null) {
                if (in_array(strtolower($envValue), ['true', '(true)'])) $envValue = true;
                elseif (in_array(strtolower($envValue), ['false', '(false)'])) $envValue = false;
                elseif (strtolower($envValue) === 'null' || strtolower($envValue) === '(null)') $envValue = null;
                
                Config::set("fu-admin.{$key}", $envValue);
            }
        }

        if (! $this->app->runningInConsole() && Schema::hasTable('futurisme_settings')) {
            try {
                $settings = FuturismeSetting::all();
                foreach ($settings as $setting) {
                    $value = $setting->value;
                    if ($setting->type === 'boolean') $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                    elseif ($setting->type === 'json') $value = json_decode($value, true);
                    elseif ($setting->type === 'integer') $value = (int) $value;

                    Config::set('fu-admin.' . $setting->key, $value);
                }
            } catch (\Exception $e) {}
        }
    }

    protected function flattenArray($array, $prefix = '')
    {
        $result = [];
        foreach ($array as $key => $value) {
            if (is_array($value) && ! empty($value)) {
                $result = array_merge($result, $this->flattenArray($value, $prefix . $key . '.'));
            } else {
                $result[$prefix . $key] = $value;
            }
        }
        return $result;
    }

    protected function configureAuth()
    {
        Config::set('auth.providers.futurisme_admins', [
            'driver' => 'eloquent',
            'model' => \Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin::class,
        ]);

        Config::set('auth.guards.futurisme', [
            'driver' => 'session',
            'provider' => 'futurisme_admins',
        ]);
    }

    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/../../src/Config/fu-admin.php', 'fu-admin'
        );

        if (! $this->app->getProvider(\Tightenco\Ziggy\ZiggyServiceProvider::class)) {
            if (class_exists(\Tightenco\Ziggy\ZiggyServiceProvider::class)) {
                $this->app->register(\Tightenco\Ziggy\ZiggyServiceProvider::class);
            }
        }
    }
}