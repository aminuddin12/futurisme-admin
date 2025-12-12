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
                $cssKey = 'src/Resources/css/app.css';
                $jsKey = 'src/Resources/js/app.tsx';
                $cssFile = $manifest[$cssKey]['file'] ?? null;
                $jsFile = $manifest[$jsKey]['file'] ?? null;
                $cssImports = $manifest[$jsKey]['css'] ?? [];
            @endphp

            @if ($cssFile)
                <link rel="stylesheet" href="{{ $asset($cssFile) }}" />
            @endif

            @foreach ($cssImports as $import)
                <link rel="stylesheet" href="{{ $asset($import) }}" />
            @endforeach

            @if ($jsFile)
                <script type="module" src="{{ $asset($jsFile) }}"></script>
            @endif
        @else
            <style>
                body { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6; font-family: sans-serif; }
                .error-box { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
                .text-red { color: #dc2626; font-weight: bold; margin-bottom: 0.5rem; }
            </style>
            <div class="error-box">
                <div class="text-red">Build Assets Not Found</div>
                <p>Run: <code>npm run build</code></p>
            </div>
        @endif
        
        @inertiaHead

        @if(Route::has('futurisme.tracker.store'))
        <script>
            (function() {
                function track() {
                    if (navigator.sendBeacon) {
                        const data = new FormData();
                        data.append('url', window.location.href);
                        data.append('referrer', document.referrer);
                        data.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
                        
                        data.append('cookies[enabled]', navigator.cookieEnabled);
                        data.append('cookies[timezone]', Intl.DateTimeFormat().resolvedOptions().timeZone);
                        data.append('cookies[screen]', window.screen.width + 'x' + window.screen.height);
                        navigator.sendBeacon('{{ route("futurisme.tracker.store") }}', data);
                    }
                }
                window.addEventListener('load', track);
            })();
        </script>
        @endif
    </head>
    <body class="font-sans antialiased h-full">
        @if ($isHot || $manifest)
            @inertia
        @endif
    </body>
</html>