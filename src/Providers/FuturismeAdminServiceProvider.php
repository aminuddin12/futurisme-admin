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
        // PENTING: Folder fisik HARUS bernama 'src/Database/Migrations' (jamak)
        // dan file di dalamnya HARUS ada timestamp (contoh: 2024_01_01_000000_nama_file.php)
        $this->loadMigrationsFrom(__DIR__.'/../../src/Database/Migrations');

        // 4. Konfigurasi Auth
        $this->configureAuth();

        // 5. Register Command & Publishing
        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallFuturismeAdmin::class,
            ]);

            // Publish Assets
            $this->publishes([
                __DIR__.'/../../public/vendor/futurisme-admin' => public_path('vendor/futurisme-admin'),
            ], 'futurisme-assets');

            // Kita biarkan opsi publish ini ada (opsional), tapi command install tidak akan memanggilnya.
            // User bisa memanggil manual jika ingin mengedit struktur tabel.
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
        // Merge Config jika ada
    }
}