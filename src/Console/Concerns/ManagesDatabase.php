<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Illuminate\Support\Facades\File;

trait ManagesDatabase
{
    protected function syncDatabaseResources(): void
    {
        if (!$this->validateInstallationKey()) {
            return;
        }

        $this->syncFiles('futurisme-migrations', database_path('migrations'), __DIR__.'/../../Database/Migrations');
        
        $this->call('migrate');

        $this->call('db:seed', [
            '--class' => 'Aminuddin12\\FuturismeAdmin\\Database\\Seeders\\FuturismeDatabaseSeeder'
        ]);
    }
}