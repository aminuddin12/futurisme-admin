<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

trait ManagesAssets
{
    protected function syncAssets(): void
    {
        if (!$this->verifyFrontendBuild()) {
            $this->warn('WARNING: Frontend build assets not found in package source!');
            $this->warn('Please run "npm run build" inside your package directory first.');
            if (!$this->confirm('Do you want to continue anyway? (View might crash)', false)) {
                throw new \RuntimeException('Installation aborted. Missing frontend assets.');
            }
        }

        $this->syncFiles('futurisme-assets', public_path('vendor/futurisme-admin'), __DIR__.'/../../../public/vendor/futurisme-admin');
        $this->syncFiles('futurisme-views', resource_path('views/vendor/futurisme'), __DIR__.'/../../Resources/views');
        $this->syncFiles('futurisme-config', config_path('fu-admin.php'), __DIR__.'/../../Config/fu-admin.php');

        if (!$this->isDeveloperMode()) {
            $this->checkForUpdates();
        }
    }

    protected function verifyFrontendBuild(): bool
    {
        $manifestPath = __DIR__.'/../../../public/vendor/futurisme-admin/.vite/manifest.json';
        return File::exists($manifestPath);
    }

    protected function removePublishedResources(): void
    {
        $publicVendorPath = public_path('vendor/futurisme-admin');
        if (File::exists($publicVendorPath)) {
            File::deleteDirectory($publicVendorPath);
        }

        $viewsVendorPath = resource_path('views/vendor/futurisme');
        if (File::exists($viewsVendorPath)) {
            File::deleteDirectory($viewsVendorPath);
        }
        
        $altViewsVendorPath = resource_path('views/vendor/futurisme-admin');
        if (File::exists($altViewsVendorPath)) {
            File::deleteDirectory($altViewsVendorPath);
        }

        $configPath = config_path('fu-admin.php');
        if (File::exists($configPath)) {
            File::delete($configPath);
        }
    }

    protected function syncFiles(string $tag, string $targetPath, string $sourcePath): void
    {
        if (File::exists($targetPath)) {
            $sourceHash = $this->getDirectoryHash($sourcePath);
            $targetHash = $this->getDirectoryHash($targetPath);

            if ($sourceHash !== $targetHash) {
                if (is_dir($targetPath)) {
                    File::deleteDirectory($targetPath);
                } else {
                    File::delete($targetPath);
                }
                
                $this->call('vendor:publish', [
                    '--tag' => $tag,
                    '--force' => true
                ]);
            }
        } else {
            $this->call('vendor:publish', [
                '--tag' => $tag,
                '--force' => true
            ]);
        }
    }

    protected function checkForUpdates(): void
    {
        try {
            $packageName = 'aminuddin12/futurisme-admin';
            $response = Http::timeout(5)->get("https://repo.packagist.org/p2/{$packageName}.json");

            if ($response->successful()) {
                $data = $response->json();
                $latestVersion = $data['packages'][$packageName][0]['version'] ?? null;
                
                $installedVersion = \Composer\InstalledVersions::getVersion($packageName);

                if ($latestVersion && version_compare($latestVersion, $installedVersion, '>')) {
                    $this->warn("A new version of Futurisme Admin ({$latestVersion}) is available.");
                }
            }
        } catch (\Exception $e) {
            
        }
    }

    private function getDirectoryHash(string $directory): string
    {
        if (!is_dir($directory)) {
            return file_exists($directory) ? md5_file($directory) : '';
        }

        $files = array();
        $dir = dir($directory);

        while (false !== ($file = $dir->read())) {
            if ($file != '.' && $file != '..') {
                if (is_dir($directory . '/' . $file)) {
                    $files[] = $this->getDirectoryHash($directory . '/' . $file);
                } else {
                    $files[] = md5_file($directory . '/' . $file);
                }
            }
        }

        $dir->close();

        return md5(implode('', $files));
    }
}