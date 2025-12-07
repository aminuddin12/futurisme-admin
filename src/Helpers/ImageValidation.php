<?php

namespace Aminuddin12\FuturismeAdmin\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ImageValidation
{
    /**
     * Daftar MIME types yang diizinkan untuk gambar.
     */
    protected const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    /**
     * Validasi apakah file yang diunggah adalah gambar yang valid.
     *
     * @param UploadedFile $file
     * @param int $maxSizeInKb Default 2MB (2048 KB)
     * @return bool
     */
    public static function isValid(UploadedFile $file, int $maxSizeInKb = 2048): bool
    {
        // 1. Cek apakah file berhasil diupload tanpa error sistem
        if (!$file->isValid()) {
            Log::warning("[ImageValidation] File upload error: " . $file->getErrorMessage());
            return false;
        }

        // 2. Validasi MIME Type
        $mime = $file->getMimeType();
        if (!in_array($mime, self::ALLOWED_MIMES)) {
            Log::warning("[ImageValidation] Invalid MIME type: {$mime}");
            return false;
        }

        // 3. Validasi Ukuran File
        $size = $file->getSize() / 1024; // Convert to KB
        if ($size > $maxSizeInKb) {
            Log::warning("[ImageValidation] File too large: {$size}KB");
            return false;
        }

        // 4. Validasi Ekstensi (Extra Layer Security)
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        if (!in_array($extension, $allowedExtensions)) {
            Log::warning("[ImageValidation] Invalid extension: {$extension}");
            return false;
        }

        // 5. Deep Scan untuk file palsu (kecuali SVG karena teks)
        if ($extension !== 'svg') {
            try {
                if (@is_array(getimagesize($file->getPathname()))) {
                    return true;
                }
            } catch (\Exception $e) {
                // Silent fail, lanjut return false
            }
            Log::warning("[ImageValidation] getimagesize failed. Possible fake image.");
            return false;
        }

        return true;
    }

    /**
     * Mendapatkan pesan error default.
     */
    public static function getErrorMessage(): string
    {
        return 'File harus berupa gambar (jpg, png, webp, svg) dan maksimal 2MB.';
    }
}