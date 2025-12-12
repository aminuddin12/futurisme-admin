<?php

namespace Aminuddin12\FuturismeAdmin\Providers;

use Illuminate\Support\ServiceProvider;
use Aminuddin12\FuturismeAdmin\Console\Commands\InstallFuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Console\Commands\UpdateFuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Console\Commands\RollbackFuturismeAdmin;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Event;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Aminuddin12\FuturismeAdmin\Listeners\FuturismeLogSubscriber;
use Illuminate\Routing\Router;

class FuturismeAdminServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $packageRoot = __DIR__.'/../../';

        $this->loadRoutesFrom($packageRoot.'routes/web.php');
        
        if (file_exists($packageRoot.'routes/assets.php')) {
            $this->loadRoutesFrom($packageRoot.'routes/assets.php'); 
        }
        
        $this->loadViewsFrom($packageRoot.'src/Resources/views', 'futurisme');
        $this->loadMigrationsFrom($packageRoot.'src/Database/Migrations');

        $this->configureAuth();
        $this->configureGates();
        
        Event::subscribe(FuturismeLogSubscriber::class);

        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('futurisme.auth', \Aminuddin12\FuturismeAdmin\Http\Middleware\Authenticate::class);
        $router->aliasMiddleware('futurisme.setup_check', \Aminuddin12\FuturismeAdmin\Http\Middleware\EnsureSetupIsCompleted::class);

        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallFuturismeAdmin::class,
                UpdateFuturismeAdmin::class,
                RollbackFuturismeAdmin::class,
            ]);
            
            $this->publishes([$packageRoot.'src/Config/fu-admin.php' => config_path('fu-admin.php')], 'futurisme-config');
            $this->publishes([$packageRoot.'src/Resources/views' => resource_path('views/vendor/futurisme')], 'futurisme-views');
            $this->publishes([$packageRoot.'public/vendor/futurisme-admin' => public_path('vendor/futurisme-admin')], 'futurisme-assets');
        }

        $this->configureDynamicSettings();
    }

    protected function configureGates()
    {
        Gate::before(function ($user, $ability) {
            if (method_exists($user, 'hasRole') && $user->hasRole('super-admin')) {
                return true;
            }
        });
    }

    protected function configureDynamicSettings()
    {
        if (! $this->app->runningInConsole() || ! app()->runningUnitTests()) {
            try {
                if (Schema::hasTable('futurisme_settings')) {
                    $settings = FuturismeSetting::all();
                    foreach ($settings as $setting) {
                        $value = $setting->value;
                        if ($setting->type === 'boolean') $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                        elseif ($setting->type === 'json') $value = json_decode($value, true);
                        elseif ($setting->type === 'integer') $value = (int) $value;

                        Config::set('fu-admin.' . $setting->key, $value);
                    }
                }
            } catch (\Exception $e) {
                // Silent fail agar tidak crash saat boot
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