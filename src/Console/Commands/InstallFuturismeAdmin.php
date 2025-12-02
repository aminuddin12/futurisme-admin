<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;

class InstallFuturismeAdmin extends Command
{
    protected $signature = 'install:futurisme-admin';
    protected $description = 'Install Futurisme Admin: check dependencies, config, assets, views, and migrations.';

    public function handle()
    {
        $this->info('🚀 Installing Futurisme Admin...');
        $this->newLine();

        // 1. Cek & Install Dependency (Ziggy)
        $this->ensureZiggyIsInstalled();

        // 2. Publish Config
        $this->info('⚙️  Publishing configuration file...');
        $this->call('vendor:publish', [
            '--tag' => 'futurisme-config',
            '--force' => true,
        ]);
        
        if (file_exists(config_path('fu-admin.php'))) {
            $this->info('   ✅ Config created: config/fu-admin.php');
        }

        // 3. Publish Views (BARU)
        // Menyalin app.blade.php ke resources/views/vendor/futurisme/app.blade.php
        $this->info('🖼️  Publishing view files...');
        $this->call('vendor:publish', [
            '--tag' => 'futurisme-views',
            '--force' => true,
        ]);

        // 4. Publish Assets
        $this->info('📂 Publishing assets...');
        $this->call('vendor:publish', [
            '--tag' => 'futurisme-assets',
            '--force' => true,
        ]);

        // 5. Run Migrations
        $this->info('⚡ Running database migrations...');
        $this->call('migrate');

        // 6. Clear Caches
        $this->info('🧹 Clearing caches...');
        $this->callSilent('config:clear');
        $this->callSilent('route:clear');
        $this->callSilent('view:clear'); // Penting agar view baru terbaca

        $this->newLine();
        $this->info('🎉 Futurisme Admin installed successfully!');
        $this->line('   Admin URL: /' . config('fu-admin.url_prefix', 'admin'));
    }

    protected function ensureZiggyIsInstalled()
    {
        $this->info('📦 Checking dependencies...');

        $composerJsonPath = base_path('composer.json');
        
        if (! file_exists($composerJsonPath)) {
            $this->warn('⚠️  Could not find composer.json in root path. Skipping dependency check.');
            return;
        }

        $composerConfig = json_decode(file_get_contents($composerJsonPath), true);
        
        $hasZiggy = isset($composerConfig['require']['tightenco/ziggy']) || 
                    isset($composerConfig['require-dev']['tightenco/ziggy']);

        if ($hasZiggy) {
            $this->info('   ✅ tightenco/ziggy is already installed in root project.');
            return; 
        }

        $this->warn('   ⚠️ tightenco/ziggy not found. Installing now...');
        
        $composer = $this->findComposer();
        passthru("$composer require tightenco/ziggy");
        
        $this->info('   ✅ tightenco/ziggy installed successfully.');
    }

    protected function findComposer()
    {
        if (file_exists(getcwd().'/composer.phar')) {
            return '"'.PHP_BINARY.'" composer.phar';
        }
        return 'composer';
    }
}