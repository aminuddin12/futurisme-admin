<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Aminuddin12\FuturismeAdmin\Console\Concerns\DetectsEnvironment;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesDependencies;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesAssets;
use Aminuddin12\FuturismeAdmin\Console\Concerns\RegistersModules;

class UpdateFuturismeAdmin extends Command
{
    use DetectsEnvironment;
    use ManagesDependencies;
    use ManagesAssets;
    use RegistersModules;

    protected $signature = 'update:futurisme-admin {--force : Force update without confirmation}';
    protected $description = 'Update Futurisme Admin resources, migrations, and optionally seeders';

    public function handle()
    {
        if (!$this->validateInstallationKey()) {
            return 1;
        }

        $this->info('Starting Futurisme Admin Update...');

        $this->ensureZiggyIsInstalled();
        $this->ensureCorsConfigExists();

        $this->info('Syncing Assets and Configurations...');
        $this->syncAssets();

        if (!File::exists(public_path('storage'))) {
            $this->call('storage:link');
        }

        $this->info('Syncing Database Migrations...');
        $this->syncFiles(
            'futurisme-migrations', 
            database_path('migrations'), 
            __DIR__.'/../../Database/Migrations'
        );

        $this->info('Publishing Activity Log Migrations...');
        $this->call('vendor:publish', [
            '--provider' => "Spatie\Activitylog\ActivitylogServiceProvider",
            '--tag' => "activitylog-migrations"
        ]);
        
        $this->info('Running Migrations...');
        $this->call('migrate');

        if ($this->confirm('Do you want to run seeders? This might update existing system data.', false)) {
            $this->info('Running Seeders...');
            $this->call('db:seed', [
                '--class' => 'Aminuddin12\\FuturismeAdmin\\Database\\Seeders\\FuturismeDatabaseSeeder'
            ]);
        }

        //$this->registerSelfAsModule();

        $this->info('Futurisme Admin updated successfully.');
        
        if ($this->isDeveloperMode()) {
            $this->info('Running in Developer Mode.');
        }

        return 0;
    }
}