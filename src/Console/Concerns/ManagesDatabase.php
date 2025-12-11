<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

trait ManagesDatabase
{
    protected function syncDatabaseResources(): void
    {
        if (!$this->validateInstallationKey()) {
            return;
        }

        $this->syncFiles('futurisme-migrations', database_path('migrations'), __DIR__.'/../../Database/Migrations');
        
        $this->info('Running Migrations...');
        $this->call('migrate');
        $this->ensureSessionTableExists();
        $this->ensureCacheTableExists();

        $this->info('Seeding Database...');
        $this->call('db:seed', [
            '--class' => 'Aminuddin12\\FuturismeAdmin\\Database\\Seeders\\FuturismeDatabaseSeeder'
        ]);
    }

    protected function wipeSystemDatabase(): void
    {
        if (!$this->validateInstallationKey()) {
            return;
        }

        Schema::disableForeignKeyConstraints();
        
        $this->call('db:wipe', [
            '--force' => true
        ]);

        Schema::enableForeignKeyConstraints();
    }

    protected function ensureSessionTableExists(): void
    {
        $driver = Config::get('session.driver');
        $table = Config::get('session.table', 'sessions');

        if ($driver === 'database' && !Schema::hasTable($table)) {
            $this->warn("Session driver is 'database' but table '{$table}' is missing.");
            $this->info("Attempting to recreate session table...");

            try {
                $this->callSilently('session:table');
            } catch (\Exception $e) {}

            $this->call('migrate');

            if (!Schema::hasTable($table)) {
                $this->error("FAILED: Could not create '{$table}' table.");
            } else {
                $this->info("Session table created successfully.");
            }
        }
    }

    protected function ensureCacheTableExists(): void
    {
        $driver = Config::get('cache.default');
        
        if ($driver === 'database') {
            $table = Config::get('cache.stores.database.table', 'cache');

            if (!Schema::hasTable($table)) {
                $this->warn("Cache driver is 'database' but table '{$table}' is missing.");
                $this->info("Attempting to recreate cache table...");

                try {
                    $this->callSilently('cache:table');
                } catch (\Exception $e) {}

                $this->call('migrate');

                if (!Schema::hasTable($table)) {
                    $this->error("FAILED: Could not create '{$table}' table.");
                } else {
                    $this->info("Cache table created successfully.");
                }
            }
        }
    }
}