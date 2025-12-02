<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;

class InstallFuturismeAdmin extends Command
{
    protected $signature = 'install:futurisme-admin';
    protected $description = 'Install Futurisme Admin: install dependencies, publish assets, and run migrations.';

    public function handle()
    {
        $this->info('🚀 Installing Futurisme Admin...');

        // 1. Install Dependency (Ziggy) Otomatis
        // Menggunakan passthru agar output composer terlihat di terminal user
        $this->info('📦 Installing required dependencies (Ziggy)...');
        
        // Cek apakah composer bisa dijalankan
        $composer = $this->findComposer();
        
        // Jalankan perintah: composer require tightenco/ziggy
        passthru("$composer require tightenco/ziggy");

        $this->newLine();

        // 2. Publish Assets (CSS/JS)
        $this->info('📂 Publishing assets...');
        $this->call('vendor:publish', [
            '--tag' => 'futurisme-assets',
            '--force' => true,
        ]);

        // 3. Jalankan Migrasi Secara Langsung
        $this->info('⚡ Running database migrations...');
        $this->call('migrate');

        $this->info('🎉 Futurisme Admin installed successfully! Dependencies, Assets, and Database are ready.');
    }

    /**
     * Helper untuk menemukan lokasi binary composer di sistem user.
     */
    protected function findComposer()
    {
        if (file_exists(getcwd().'/composer.phar')) {
            return '"'.PHP_BINARY.'" composer.phar';
        }

        return 'composer';
    }
}