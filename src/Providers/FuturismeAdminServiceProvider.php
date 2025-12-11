<?php

namespace Aminuddin12\FuturismeAdmin\Providers;

use Illuminate\Support\ServiceProvider;
use Aminuddin12\FuturismeAdmin\Console\Commands\InstallFuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Console\Commands\UpdateFuturismeAdmin;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Illuminate\Routing\Router;

class FuturismeAdminServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $packageRoot = __DIR__.'/../../';

        // Load Routes & Views
        $this->loadRoutesFrom($packageRoot.'routes/web.php');
        $this->loadRoutesFrom($packageRoot.'routes/assets.php');
        $this->loadViewsFrom($packageRoot.'src/Resources/views', 'futurisme');
        $this->loadMigrationsFrom($packageRoot.'src/Database/Migrations');

        // Config Auth
        $this->configureAuth();

        // Register Middleware Alias
        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('futurisme.auth', \Aminuddin12\FuturismeAdmin\Http\Middleware\Authenticate::class);
        // Middleware baru untuk cek setup
        $router->aliasMiddleware('futurisme.setup_check', \Aminuddin12\FuturismeAdmin\Http\Middleware\EnsureSetupIsCompleted::class);

        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallFuturismeAdmin::class,
                UpdateFuturismeAdmin::class,
            ]);
            
            // Publishes... (sama seperti sebelumnya)
            $this->publishes([$packageRoot.'src/Config/fu-admin.php' => config_path('fu-admin.php')], 'futurisme-config');
            $this->publishes([$packageRoot.'src/Resources/views' => resource_path('views/vendor/futurisme')], 'futurisme-views');
            $this->publishes([$packageRoot.'public/vendor/futurisme-admin' => public_path('vendor/futurisme-admin')], 'futurisme-assets');
        }

        // KONFIGURASI DINAMIS (Database Override)
        // Dijalankan di boot() agar tabel dan model sudah siap
        $this->configureDynamicSettings();
    }

    protected function configureDynamicSettings()
    {
        // 1. Config File sudah dimuat di register() (yang mungkin ambil dari .env)
        
        // 2. Override dengan Database (Prioritas Tertinggi)
        // Cek dulu apakah kita tidak sedang menjalankan migrasi (agar tidak error table not found saat migrate)
        if (! $this->app->runningInConsole() || ! app()->runningUnitTests()) {
            if (Schema::hasTable('futurisme_settings')) {
                try {
                    $settings = FuturismeSetting::all();
                    foreach ($settings as $setting) {
                        $value = $setting->value;
                        if ($setting->type === 'boolean') $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                        elseif ($setting->type === 'json') $value = json_decode($value, true);
                        elseif ($setting->type === 'integer') $value = (int) $value;

                        // TIMPA config memori dengan nilai dari DB
                        Config::set('fu-admin.' . $setting->key, $value);
                    }
                } catch (\Exception $e) {
                    // Silent fail jika koneksi DB bermasalah
                }
            }
        }
    }

    protected function configureAuth() { 
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
        $this->mergeConfigFrom(__DIR__.'/../../src/Config/fu-admin.php', 'fu-admin');
        
        $ziggyProvider = '\Tightenco\Ziggy\ZiggyServiceProvider';

        if (class_exists($ziggyProvider)) {
            if (! $this->app->getProviders($ziggyProvider)) {
                $this->app->register($ziggyProvider);
            }
        }
    }
}