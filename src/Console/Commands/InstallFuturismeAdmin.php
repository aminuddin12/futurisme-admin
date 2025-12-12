<?php

namespace Aminuddin12\FuturismeAdmin\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Aminuddin12\FuturismeAdmin\Console\Concerns\DetectsEnvironment;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesDependencies;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesAssets;
use Aminuddin12\FuturismeAdmin\Console\Concerns\ManagesDatabase;
use Aminuddin12\FuturismeAdmin\Console\Concerns\RegistersModules;

class InstallFuturismeAdmin extends Command
{
    use DetectsEnvironment;
    use ManagesDependencies;
    use ManagesAssets;
    use ManagesDatabase;
    use RegistersModules;

    protected $signature = 'install:futurisme-admin';
    protected $description = 'Install Futurisme Admin with smart environment detection';

    public function handle()
    {
        if (!$this->validateInstallationKey()) {
            return 1;
        }
        
        $this->clearSystemCaches();

        $this->ensureZiggyIsInstalled();
        $this->ensureCorsConfigExists();

        try {
            $this->syncAssets();
        } catch (\Exception $e) {
            $this->error($e->getMessage());
            return 1;
        }

        if (!File::exists(public_path('storage'))) {
            $this->call('storage:link');
        }

        $this->info('Publishing Activity Log Migrations...');
        $this->call('vendor:publish', [
            '--provider' => "Spatie\Activitylog\ActivitylogServiceProvider",
            '--tag' => "activitylog-migrations"
        ]);

        $this->syncDatabaseResources();
        
        $this->registerSelfAsModule();

        $this->clearSystemCaches();

        $this->info('Futurisme Admin installation completed successfully.');
        
        if ($this->isDeveloperMode()) {
            $this->info('Running in Developer Mode.');
        }

        return 0;
    }
}