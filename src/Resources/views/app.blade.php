<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @routes

    {{-- Injeksi Config Ziggy (Tetap Sama) --}}
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
        LOGIKA LOAD ASSET DENGAN MANIFEST (HASHING SUPPORT) 
        Kita baca manifest.json untuk mendapatkan nama file asli (misal: app-XH123.css)
    --}}
    @php
        $manifestPath = public_path('vendor/futurisme-admin/.vite/manifest.json');
        $cssFile = 'vendor/futurisme-admin/assets/app.css'; // Fallback
        $jsFile = 'vendor/futurisme-admin/assets/app.js';   // Fallback

        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            
            // Key di manifest biasanya relatif terhadap root source, misal 'src/Resources/css/app.css'
            // Sesuaikan dengan input di vite.config.ts
            $cssKey = 'src/Resources/css/app.css';
            $jsKey = 'src/Resources/js/app.tsx';

            if (isset($manifest[$cssKey]['file'])) {
                $cssFile = 'vendor/futurisme-admin/' . $manifest[$cssKey]['file'];
            }
            if (isset($manifest[$jsKey]['file'])) {
                $jsFile = 'vendor/futurisme-admin/' . $manifest[$jsKey]['file'];
            }
        }
    @endphp

    {{-- Load CSS --}}
    <link rel="stylesheet" href="{{ asset($cssFile) }}">
    
    {{-- Load JS --}}
    <script type="module" src="{{ asset($jsFile) }}" defer></script>
    
    {{-- Preload Vendor Chunks jika ada di manifest (Opsional tapi bagus untuk performa) --}}
    @if(isset($manifest) && isset($manifest[$jsKey]['imports']))
        @foreach($manifest[$jsKey]['imports'] as $import)
            <link rel="modulepreload" href="{{ asset('vendor/futurisme-admin/' . $manifest[$import]['file']) }}">
        @endforeach
    @endif
    
    @inertiaHead
</head>
<body class="fa-bg-gray-100 fa-font-sans fa-antialiased">
    @inertia
</body>
</html>