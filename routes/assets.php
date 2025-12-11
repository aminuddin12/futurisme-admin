<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

/*
|--------------------------------------------------------------------------
| Asset Fallback Routes
|--------------------------------------------------------------------------
|
|
*/

Route::get('vendor/futurisme-admin/{path}', function ($path) {
    $packagePublicPath = __DIR__ . '/../public/vendor/futurisme-admin/' . $path;

    if (!File::exists($packagePublicPath)) {
        abort(404);
    }

    $mimeType = File::mimeType($packagePublicPath);

    if (str_ends_with($path, '.css')) {
        $mimeType = 'text/css';
    } elseif (str_ends_with($path, '.js')) {
        $mimeType = 'application/javascript';
    } elseif (str_ends_with($path, '.svg')) {
        $mimeType = 'image/svg+xml';
    }

    return Response::file($packagePublicPath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*');