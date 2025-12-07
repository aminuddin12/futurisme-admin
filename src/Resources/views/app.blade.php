<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Futurisme Ecosystem') }}</title>

    {{-- Favicon --}}
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

    @routes

    {{-- Config Ziggy --}}
    @php
        $ziggyConfig = null;
        try {
            if (class_exists(\Tightenco\Ziggy\Ziggy::class)) {
                $ziggy = new \Tightenco\Ziggy\Ziggy;
                $ziggyConfig = $ziggy->toArray();
            }
        } catch (\Exception $e) {}
    @endphp

    @if ($ziggyConfig)
        <script>
            const Ziggy = <?php echo json_encode($ziggyConfig); ?>;
            if (typeof window !== 'undefined') {
                Object.assign(window.Ziggy || {}, Ziggy);
            }
        </script>
    @else
        <script>
            if (typeof window !== 'undefined') {
                window.Ziggy = { url: '{{ url("/") }}', port: null, defaults: {}, routes: {} };
            }
        </script>
    @endif

    {{-- 
        === ASSET LOADER (PACKAGE MODE) ===
        Mencoba load dari manifest build produksi.
    --}}
    @php
        $publicPath = 'vendor/futurisme-admin'; // Folder di public/
        $manifestFile = public_path($publicPath . '/.vite/manifest.json');
        
        $cssFile = null;
        $jsFile = null;

        if (file_exists($manifestFile)) {
            $manifest = json_decode(file_get_contents($manifestFile), true);
            
            // Key harus sama persis dengan input di vite.config.ts
            $cssInput = 'src/Resources/css/app.css';
            $jsInput = 'src/Resources/js/app.tsx';

            // Ambil path file hasil build (biasanya ada hash-nya)
            if (isset($manifest[$cssInput]['file'])) {
                $cssFile = asset($publicPath . '/' . $manifest[$cssInput]['file']);
            }
            
            if (isset($manifest[$jsInput]['file'])) {
                $jsFile = asset($publicPath . '/' . $manifest[$jsInput]['file']);
            }
        }
    @endphp

    {{-- DEBUG MODE: Jika asset tidak ketemu --}}
    @if(!$jsFile)
        <script>
            console.error(
                'Futurisme Error: Asset Manifest not found or invalid.\n' +
                'Path checked: {{ $manifestFile }}\n' + 
                'Please run "npm run build" inside the package and "php artisan vendor:publish --tag=futurisme-assets --force"'
            );
        </script>
        {{-- Fallback: Coba load manual jika user lupa build (dev mode kasar) --}}
        {{-- <script type="module" src="http://localhost:5173/src/Resources/js/app.tsx"></script> --}}
    @else
        {{-- Production Assets --}}
        @if($cssFile)
            <link rel="stylesheet" href="{{ $cssFile }}" />
        @endif
        <script type="module" src="{{ $jsFile }}" defer></script>
    @endif

    @inertiaHead
</head>
<body class="bg-gray-50 font-sans antialiased text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    @inertia
</body>
</html>