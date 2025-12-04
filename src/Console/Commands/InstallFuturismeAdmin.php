<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;
use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;
use Illuminate\Support\Facades\DB;

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

        $this->registerSelfAsModule();

        // BARU: Jalankan Seeder
        $this->info('🌱 Seeding default data...');
        $this->call('db:seed', [
            '--class' => 'Aminuddin12\\FuturismeAdmin\\Database\\Seeders\\FuturismeDatabaseSeeder'
        ]);

        // 6. Clear Caches
        $this->info('🧹 Clearing caches...');
        $this->callSilent('optimize:clear');
        $this->callSilent('config:clear');
        $this->callSilent('route:clear');
        $this->callSilent('view:clear'); // Penting agar view baru terbaca

        $this->newLine();
        $this->info('🎉 Futurisme Admin installed successfully!');
        // URL Setup Awal
        $this->warn('⚠️  ACTION REQUIRED:');
        $this->line('   Please configure your admin panel by visiting:');
        $this->line('   👉 ' . url('/fu-settings'));
    }

    protected function registerSelfAsModule()
    {
        $this->info('📦 Registering Futurisme Admin package...');

        try {
            // Path ke composer.json paket ini (naik 3 level dari folder Commands)
            $composerPath = __DIR__ . '/../../../composer.json';
            
            if (!file_exists($composerPath)) {
                $this->error('   ❌ Could not find composer.json for Futurisme Admin.');
                return;
            }

            $composer = json_decode(file_get_contents($composerPath), true);
            
            // Simpan ke database
            // Kita set 'data' menjadi NULL untuk menandakan "Belum Dikonfigurasi"
            FuturismeModule::updateOrCreate(
                ['plugin' => $composer['name']], 
                [
                    'name' => 'Futurisme Admin Panel',
                    'description' => $composer['description'] ?? 'Core admin panel package',
                    'version' => '1.0.0', // Atau ambil dari tag git jika memungkinkan
                    'checksum' => md5_file($composerPath),
                    'dependencies' => $composer['require'] ?? [],
                    'data' => null, // PENTING: Dikosongi sebagai tanda perlu setup
                    'status' => 'active',
                    'is_core' => true,
                    'installed_at' => now(),
                ]
            );

            $this->info('   ✅ Package registered in system ecosystem.');

        } catch (\Exception $e) {
            $this->error('   ❌ Failed to register module: ' . $e->getMessage());
        }
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