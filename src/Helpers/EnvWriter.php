<?php

namespace Aminuddin12\FuturismeAdmin\Helpers;

use Exception;
use Illuminate\Support\Facades\Auth;
use Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;

class EnvWriter
{
    /**
     * Update .env file dengan validasi keamanan ketat.
     * * @param array $data Key-value pair data 
     * @return bool
     * @throws Exception Jika akses ditolak atau file tidak writable
     */
    public static function update(array $data)
    {
        $path = base_path('.env');

        if (!file_exists($path)) {
            return false;
        }

        if (!is_writable($path)) {
            throw new Exception("File .env tidak dapat ditulis. Periksa permission server.");
        }

        // --- SECURITY CHECK LAYER ---
        
        // 1. Cek Status Setup (Apakah Admin sudah ada?)
        $isSetupCompleted = false;
        try {
            $isSetupCompleted = FuturismeAdmin::exists();
        } catch (\Exception $e) {
            $isSetupCompleted = false; // Asumsi tabel belum ada/setup awal
        }

        // 2. Cek User saat ini
        $currentUser = Auth::guard('futurisme')->user();
        $isSuperAdmin = $currentUser && $currentUser->is_super_admin;

        // 3. Logika Validasi Akses
        if ($isSetupCompleted) {
            // Skenario: Setup sudah selesai (Admin ada)
            
            if (!$isSuperAdmin) {
                // Jika bukan Super Admin, kita cek apakah ini pengisian parsial (data kosong)
                foreach ($data as $key => $val) {
                    if (!self::isSettingEmptyInDatabase($key)) {
                        throw new Exception("Akses Ditolak: Hanya Super Admin yang dapat mengubah konfigurasi sistem inti yang sudah terisi.");
                    }
                }
                // Jika lolos loop di atas, berarti user mencoba mengisi data yang masih kosong di DB.
                // Izinkan lanjut (Partial Update allowed for empty fields)
            } 
            // Jika Super Admin, lolos (Boleh edit apa saja)
        } 
        else {
            // Skenario: Setup belum selesai (Belum ada Admin)
            // Izinkan akses penuh untuk instalasi awal
        }

        // --- WRITE PROCESS ---

        $envContent = file_get_contents($path);
        $hasChanges = false;

        foreach ($data as $key => $value) {
            $formattedValue = self::formatValue($value);
            
            // Cek apakah key sudah ada
            $pattern = "/^{$key}=.*/m";
            
            if (preg_match($pattern, $envContent)) {
                // Jika ada, ganti nilainya
                $envContent = preg_replace($pattern, "{$key}={$formattedValue}", $envContent);
            } else {
                // Jika tidak ada, tambahkan baris baru
                if (!empty($envContent) && substr($envContent, -1) != "\n") {
                    $envContent .= "\n";
                }
                $envContent .= "{$key}={$formattedValue}\n";
            }
            $hasChanges = true;
        }

        if ($hasChanges) {
            return file_put_contents($path, $envContent) !== false;
        }

        return true;
    }

    /**
     * Cek apakah setting tertentu nilainya kosong/null di database.
     * Digunakan untuk mengizinkan partial update pada environment yang belum lengkap.
     */
    private static function isSettingEmptyInDatabase(string $envKey): bool
    {
        // Mapping Env Key ke Database Key (jika beda)
        // Default: FUTURISME_SITE_NAME -> site_name
        $dbKey = strtolower(str_replace('FUTURISME_', '', $envKey));
        
        // Cek map manual jika nama beda jauh
        if ($envKey === 'APP_URL') $dbKey = 'site_url';
        if ($envKey === 'APP_LOCALE') $dbKey = 'locale';

        try {
            $setting = FuturismeSetting::where('key', $dbKey)->first();
            // Jika setting tidak ada di DB, atau valuenya null/kosong string -> True (Boleh diedit)
            if (!$setting) return true;
            return empty($setting->value);
        } catch (\Exception $e) {
            return true; // Fail-safe: anggap kosong agar tidak memblokir perbaikan
        }
    }

    private static function formatValue($value)
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_null($value)) {
            return 'null';
        }

        $value = (string) $value;

        // Quote value jika ada spasi atau karakter khusus
        if (preg_match('/\s/', $value) || str_contains($value, '#') || str_contains($value, '"')) {
            $value = str_replace('"', '\"', $value);
            return '"' . $value . '"';
        }
        
        return $value;
    }
}