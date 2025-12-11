<?php

namespace Aminuddin12\FuturismeAdmin\Console\Concerns;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

trait ManagesAssets
{
    protected function syncAssets(): void
    {
        $this->syncFiles('futurisme-assets', public_path('vendor/futurisme-admin'), __DIR__.'/../../../public/vendor/futurisme-admin');
        $this->syncFiles('futurisme-views', resource_path('views/vendor/futurisme'), __DIR__.'/../../Resources/views');
        $this->syncFiles('futurisme-config', config_path('fu-admin.php'), __DIR__.'/../../Config/fu-admin.php');

        if (!$this->isDeveloperMode()) {
            $this->checkForUpdates();
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
            return md5_file($directory);
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