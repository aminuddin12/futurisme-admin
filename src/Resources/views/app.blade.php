<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-100">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('fu-admin.app.name', 'Futurisme Admin') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @routes
        
        @php
            $buildDir = 'vendor/futurisme-admin';
            
            $hotPath = public_path($buildDir . '/hot');
            $isHot = file_exists($hotPath);

            $manifest = null;
            
            if (!$isHot) {
                $hostManifestPath = public_path($buildDir . '/.vite/manifest.json');
                $packageRoot = realpath(__DIR__ . '/../../..');
                $sourceManifestPath = $packageRoot ? ($packageRoot . '/public/' . $buildDir . '/.vite/manifest.json') : null;

                if (file_exists($hostManifestPath)) {
                    $manifest = json_decode(file_get_contents($hostManifestPath), true);
                } elseif ($sourceManifestPath && file_exists($sourceManifestPath)) {
                    $manifest = json_decode(file_get_contents($sourceManifestPath), true);
                }
            }
        @endphp

        @if ($isHot)
            @vite(['src/Resources/css/app.css', 'src/Resources/js/app.tsx'], $buildDir)
        
        @elseif ($manifest)
            @php
                $asset = fn($path) => asset($buildDir . '/' . $path);
                
                $jsKey = 'src/Resources/js/app.tsx';
                $jsFile = $manifest[$jsKey]['file'] ?? null;

                $allCssFiles = [];
                foreach ($manifest as $key => $item) {
                    if (isset($item['file']) && str_ends_with($item['file'], '.css')) {
                        $allCssFiles[] = $item['file'];
                    }
                    // Cek juga properti 'css' array di dalam item JS
                    if (isset($item['css']) && is_array($item['css'])) {
                        foreach ($item['css'] as $cssImport) {
                            $allCssFiles[] = $cssImport;
                        }
                    }
                }
                // Hapus duplikat
                $allCssFiles = array_unique($allCssFiles);
            @endphp

            @foreach ($allCssFiles as $cssFile)
                <link rel="stylesheet" href="{{ $asset($cssFile) }}" />
            @endforeach

            @if ($jsFile)
                <script type="module" src="{{ $asset($jsFile) }}"></script>
            @endif

        @else
            <style>
                body { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6; font-family: sans-serif; }
                .error-box { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 28rem; text-align: center; }
                .text-red { color: #dc2626; font-weight: bold; margin-bottom: 0.5rem; }
            </style>
            <div class="error-box">
                <div class="text-red">Build Assets Not Found</div>
                <p>Run: <code>npm run build</code></p>
            </div>
        @endif
        
        @inertiaHead
    </head>
    <body class="font-sans antialiased h-full">
        @if ($isHot || $manifest)
            @inertia
        @endif
    </body>
</html>