<?php

namespace Aminuddin12\FuturismeAdmin\Helpers;

use Exception;

class EnvWriter
{
    /**
     * * @param array $data Key-value pair data 
     * @return bool
     * @throws Exception
     */
    public static function update(array $data)
    {
        $path = base_path('.env');

        if (!file_exists($path)) {
            return false;
        }

        if (!is_writable($path)) {
            throw new Exception("Can't write on .env file . Please Check your (permissions) on server file.");
        }

        $envContent = file_get_contents($path);

        foreach ($data as $key => $value) {
            $formattedValue = self::formatValue($value);
            $pattern = "/^{$key}=.*/m";

            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, "{$key}={$formattedValue}", $envContent);
            } else {
                if (!empty($envContent) && substr($envContent, -1) != "\n") {
                    $envContent .= "\n";
                }
                $envContent .= "{$key}={$formattedValue}\n";
            }
        }

        return file_put_contents($path, $envContent) !== false;
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

        if (preg_match('/\s/', $value) || str_contains($value, '#') || str_contains($value, '"')) {
            $value = str_replace('"', '\"', $value);
            return '"' . $value . '"';
        }
        return $value;
    }
}