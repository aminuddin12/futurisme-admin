<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Illuminate\Support\Facades\App;

trait DetectsEnvironment
{
    protected function isDeveloperMode(): bool
    {
        $packagePath = realpath(__DIR__ . '/../../../');
        
        return str_contains($packagePath, 'packages') && !str_contains($packagePath, 'vendor');
    }

    protected function validateInstallationKey(): bool
    {
        if ($this->isDeveloperMode()) {
            return true;
        }

        $key = env('FUTURISME_ADMIN_KEY');
        $tempKey = 'kuncishusussementara';

        if ($key === $tempKey) {
            return true;
        }

        $this->error('Invalid installation key. Please check your FUTURISME_ADMIN_KEY in .env file.');
        return false;
    }
}