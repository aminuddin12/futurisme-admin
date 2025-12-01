<?php

namespace Aminuddin12\FuturismeAdmin\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Aminuddin12\FuturismeAdmin\Console\Commands\InstallFuturismeAdmin;

class FuturismeAdminServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // 1. Load Routes
        $this->loadRoutesFrom(__DIR__.'/../../routes/web.php');

        // 2. Load Views (Namespace: futurisme)
        $this->loadViewsFrom(__DIR__.'/../../src/Resources/views', 'futurisme');

        // 3. Load Migrations (tanpa harus publish)
        $this->loadMigrationsFrom(__DIR__.'/../../src/Database/Migrations');

        // 4. Register Command
        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallFuturismeAdmin::class,
            ]);

            // Setup Publishable Assets (CSS/JS yang sudah dibuild)
            $this->publishes([
                __DIR__.'/../../public/vendor/futurisme-admin' => public_path('vendor/futurisme-admin'),
            ], 'futurisme-assets');
        }
    }

    public function register()
    {
        // Merge Config jika ada
    }
}
