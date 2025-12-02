<?php

namespace Aminuddin12\FuturismeAdmin\Helpers;

class EnvWriter
{
    public static function update(array $data)
    {
        $path = base_path('.env');

        if (!file_exists($path)) {
            return;
        }

        $envContent = file_get_contents($path);

        foreach ($data as $key => $value) {
            // Bungkus nilai string dengan kutip jika ada spasi
            if (str_contains($value, ' ')) {
                $value = '"' . $value . '"';
            }
            
            // Konversi boolean ke string
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            // Cek apakah Key sudah ada
            if (preg_match("/^{$key}=/m", $envContent)) {
                // Update baris yang ada
                $envContent = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $envContent);
            } else {
                // Tambahkan baris baru di akhir
                $envContent .= "\n{$key}={$value}";
            }
        }

        file_put_contents($path, $envContent);
    }
}