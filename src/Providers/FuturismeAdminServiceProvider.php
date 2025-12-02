<?php

namespace Aminuddin12\FuturismeAdmin\Providers;

use Illuminate\Support\ServiceProvider;
use Aminuddin12\FuturismeAdmin\Console\Commands\InstallFuturismeAdmin;
use Illuminate\Support\Facades\Config;

class FuturismeAdminServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // 1. Load Routes
        $this->loadRoutesFrom(__DIR__.'/../../routes/web.php');

        // 2. Load Views
        $this->loadViewsFrom(__DIR__.'/../../src/Resources/views', 'futurisme');

        // 3. Load Migrations
        $this->loadMigrationsFrom(__DIR__.'/../../src/Database/Migrations');

        // 4. Konfigurasi Auth
        $this->configureAuth();

        // 5. Register Command & Publishing
        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallFuturismeAdmin::class,
            ]);

            $this->publishes([
                __DIR__.'/../../public/vendor/futurisme-admin' => public_path('vendor/futurisme-admin'),
            ], 'futurisme-assets');

            $this->publishes([
                __DIR__.'/../../src/Database/Migrations' => database_path('migrations'),
            ], 'futurisme-migrations');
        }
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
        // PERBAIKAN: Menggunakan getProvider() untuk cek apakah provider sudah ada
        // getProvider mengembalikan null jika belum di-load
        if (! $this->app->getProvider(\Tightenco\Ziggy\ZiggyServiceProvider::class)) {
            if (class_exists(\Tightenco\Ziggy\ZiggyServiceProvider::class)) {
                $this->app->register(\Tightenco\Ziggy\ZiggyServiceProvider::class);
            }
        }
    }
}