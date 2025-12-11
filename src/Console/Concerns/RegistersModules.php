<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Aminuddin12\FuturismeAdmin\Models\FuturismeModule;

trait RegistersModules
{
    protected function registerSelfAsModule(): void
    {
        try {
            $composerPath = __DIR__ . '/../../../composer.json';
            
            if (!file_exists($composerPath)) {
                return;
            }

            $composer = json_decode(file_get_contents($composerPath), true);
            $moduleName = $composer['name'] ?? 'aminuddin12/futurisme-admin';

            FuturismeModule::updateOrCreate(
                ['name' => $moduleName],
                [
                    'description' => $composer['description'] ?? 'Core admin panel package',
                    'version' => $composer['version'] ?? '1.0.2',
                    'checksum' => md5_file($composerPath),
                    'dependencies' => $composer['require'] ?? [],
                    'data' => null,
                    'status' => 'active',
                    'is_core' => true,
                    'installed_at' => now(),
                ]
            );
            
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }
}