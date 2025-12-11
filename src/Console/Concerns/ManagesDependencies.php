<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Illuminate\Support\Facades\Artisan;

trait ManagesDependencies
{
    protected function ensureZiggyIsInstalled(): void
    {
        $composerJsonPath = base_path('composer.json');
        
        if (!file_exists($composerJsonPath)) {
            return;
        }

        $composerConfig = json_decode(file_get_contents($composerJsonPath), true);
        $hasZiggy = isset($composerConfig['require']['tightenco/ziggy']) || isset($composerConfig['require-dev']['tightenco/ziggy']);

        if ($hasZiggy) {
            return; 
        }

        $composer = $this->findComposer();
        passthru("$composer require tightenco/ziggy");
    }

    protected function ensureCorsConfigExists(): void
    {
        if (!file_exists(config_path('cors.php'))) {
            $this->call('vendor:publish', [
                '--tag' => 'cors',
                '--force' => true,
            ]);
        }
    }

    protected function clearSystemCaches(): void
    {
        $this->info('Clearing system caches...');
        
        try {
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
        } catch (\Throwable $e) {
            $this->warn('   Note: Failed to clear config/route/view cache (safely ignored).');
        }

        try {
            Artisan::call('cache:clear');
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'SQLSTATE[42P01]')) {
                 $this->warn('   Note: Skipping cache:clear (database cache table not ready yet).');
            } else {
                 $this->warn('   Note: Failed to clear application cache: ' . $e->getMessage());
            }
        }
        
        $bootstrapCache = base_path('bootstrap/cache/config.php');
        if (file_exists($bootstrapCache)) {
            @unlink($bootstrapCache);
        }
    }

    protected function findComposer(): string
    {
        if (file_exists(getcwd().'/composer.phar')) {
            return '"'.PHP_BINARY.'" composer.phar';
        }
        return 'composer';
    }
}