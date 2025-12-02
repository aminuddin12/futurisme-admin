<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;

class InstallFuturismeAdmin extends Command
{
    protected $signature = 'install:futurisme-admin';
    protected $description = 'Install Futurisme Admin: publish assets and run migrations automatically.';

    public function handle()
    {
        $this->info('🚀 Installing Futurisme Admin...');

        // 1. Publish Assets (CSS/JS)
        $this->info('📂 Publishing assets...');
        $this->call('vendor:publish', [
            '--tag' => 'futurisme-assets',
            '--force' => true,
        ]);

        // 2. Jalankan Migrasi Secara Langsung
        // Karena kita sudah pakai loadMigrationsFrom() di ServiceProvider,
        // perintah ini akan otomatis membaca folder src/Database/Migrations paket ini.
        $this->info('⚡ Running database migrations...');
        $this->call('migrate');

        $this->info('🎉 Futurisme Admin installed successfully! Database tables created.');
    }
}