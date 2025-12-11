<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;
use Aminuddin12\FuturismeAdmin\Console\Concerns\DetectsEnvironment;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesAssets;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesDatabase;

class RollbackFuturismeAdmin extends Command
{
    use DetectsEnvironment;
    use ManagesAssets;
    use ManagesDatabase;

    protected $signature = 'rollback:futurisme-admin {--force : Force rollback without confirmation}';
    protected $description = 'Rollback Futurisme Admin: wipe DB, clean env, remove assets & configs';

    public function handle()
    {
        if (!$this->validateInstallationKey()) {
            return 1;
        }

        $this->alert('WARNING: THIS ACTION IS DESTRUCTIVE!');
        $this->warn('1. It will DROP ALL TABLES in your database.');
        $this->warn('2. It will REMOVE all Futurisme configurations and assets.');
        
        if (!$this->option('force') && !$this->confirm('Are you absolutely sure you want to proceed?', false)) {
            $this->info('Rollback cancelled.');
            return 0;
        }

        $this->info('Wiping Database...');
        $this->wipeSystemDatabase();

        $this->info('Removing Environment Variables...');
        $this->removeFuturismeEnvVars();

        $this->info('Removing Published Resources (Assets, Views, Config)...');
        $this->removePublishedResources();

        $this->info('Futurisme Admin Rollback completed successfully.');
        
        return 0;
    }
}