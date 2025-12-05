<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;
use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;

class InstallFuturismeAdmin extends Command
{
    protected $signature = 'install:futurisme-admin';
    protected $description = 'Install Futurisme Admin: check dependencies, config, assets, views, migrations, and register module.';

    public function handle()
    {
        $this->info('🚀 Installing Futurisme Admin...');
        $this->newLine();

        // 1. Cek & Install Dependency
        $this->ensureZiggyIsInstalled();

        // 2. Publish Config (fu-admin.php)
        $this->info('⚙️  Publishing configuration file...');
        $this->call('vendor:publish', ['--tag' => 'futurisme-config', '--force' => true]);

        // BARU: Cek dan Publish CORS jika belum ada
        $this->ensureCorsConfigExists();

        // 3. Publish Views
        $this->info('🖼️  Publishing view files...');
        $this->call('vendor:publish', ['--tag' => 'futurisme-views', '--force' => true]);

        // 4. Publish Assets
        $this->info('📂 Publishing assets...');
        $this->call('vendor:publish', ['--tag' => 'futurisme-assets', '--force' => true]);

        // 5. Run Migrations
        $this->info('⚡ Running database migrations...');
        $this->call('migrate');

        // 6. Register Module to Database (Data Kosong)
        $this->registerSelfAsModule();

        // 7. Run Seeder (Settings akan di-seed sebagai NULL disini)
        $this->info('🌱 Seeding default data...');
        $this->call('db:seed', [
            '--class' => 'Aminuddin12\\FuturismeAdmin\\Database\\Seeders\\FuturismeDatabaseSeeder'
        ]);

        // 8. Clear Caches
        $this->info('🧹 Clearing caches...');
        $this->callSilent('optimize:clear');
        $this->callSilent('config:clear');
        $this->callSilent('route:clear');
        $this->callSilent('view:clear');

        $this->newLine();
        $this->info('🎉 Futurisme Admin installed successfully!');
        
        $this->warn('⚠️  CONFIGURATION REQUIRED:');
        $this->line('   To complete the installation, please configure the application at:');
        $this->line('   👉 ' . url('/fu-settings'));
        $this->newLine();
    }

    protected function ensureCorsConfigExists()
    {
        $corsPath = config_path('cors.php');
        
        if (file_exists($corsPath)) {
            $this->info('   ✅ cors.php already exists. Skipping publication.');
            return;
        }

        $this->info('   📦 Publishing cors.php...');
        
        // Asumsi file cors.php ada di root package/config/cors.php
        // Sesuaikan path sumber jika berbeda
        $source = __DIR__ . '/../../../../config/cors.php'; 
        
        if (file_exists($source)) {
            copy($source, $corsPath);
            $this->info('   ✅ cors.php published successfully.');
        } else {
            // Fallback: Buat file jika source tidak ketemu (opsional, tapi aman)
            $content = "<?php\n\nreturn [\n    'paths' => ['api/*', 'sanctum/csrf-cookie', 'fu-settings/*', 'vendor/*'],\n    'allowed_methods' => ['*'],\n    'allowed_origins' => ['*'],\n    'allowed_origins_patterns' => [],\n    'allowed_headers' => ['*'],\n    'exposed_headers' => [],\n    'max_age' => 0,\n    'supports_credentials' => false,\n];";
            file_put_contents($corsPath, $content);
            $this->info('   ✅ cors.php created successfully (fallback).');
        }
    }

    // ... (sisa method registerSelfAsModule, ensureZiggyIsInstalled, findComposer tetap sama) ...
    protected function registerSelfAsModule()
    {
        $this->info('📦 Registering Futurisme Admin package...');

        try {
            $composerPath = __DIR__ . '/../../../composer.json';
            
            if (!file_exists($composerPath)) {
                $this->error('   ❌ Could not find composer.json.');
                return;
            }

            $composer = json_decode(file_get_contents($composerPath), true);
            
            FuturismeModule::updateOrCreate(
                ['plugin' => $composer['name']], 
                [
                    'name' => 'Futurisme Admin Panel',
                    'description' => $composer['description'] ?? 'Core admin panel package',
                    'version' => $composer['version'] ?? '1.0.0-beta',
                    'checksum' => md5_file($composerPath),
                    'dependencies' => $composer['require'] ?? [],
                    'data' => null,
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
        
        if (! file_exists($composerJsonPath)) return;

        $composerConfig = json_decode(file_get_contents($composerJsonPath), true);
        $hasZiggy = isset($composerConfig['require']['tightenco/ziggy']) || isset($composerConfig['require-dev']['tightenco/ziggy']);

        if ($hasZiggy) {
            $this->info('   ✅ tightenco/ziggy is already installed.');
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