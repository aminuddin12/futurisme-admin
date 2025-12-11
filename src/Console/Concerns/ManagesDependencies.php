<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

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

    protected function findComposer(): string
    {
        if (file_exists(getcwd().'/composer.phar')) {
            return '"'.PHP_BINARY.'" composer.phar';
        }
        return 'composer';
    }
}