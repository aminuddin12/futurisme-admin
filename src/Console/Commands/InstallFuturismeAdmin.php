<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;

class InstallFuturismeAdmin extends Command
{
    protected $signature = 'install:futurisme-admin';
    protected $description = 'Install Futurisme Admin assets and setup';

    public function handle()
    {
        $this->info('Installing Futurisme Admin...');

        // 1. Publish Assets (Pre-compiled JS/CSS)
        $this->call('vendor:publish', [
            '--tag' => 'futurisme-assets',
            '--force' => true,
        ]);

        // 2. Run Migrations (Opsional, atau user disuruh migrate sendiri)
        if ($this->confirm('Do you want to run module migrations now?', true)) {
            $this->call('migrate');
        }

        $this->info('Futurisme Admin installed successfully.');
    }
}
