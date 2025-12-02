<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- 
        Injeksi Config Ziggy yang Aman.
    --}}
    @php
        $ziggyConfig = null;
        try {
            if (class_exists(\Tightenco\Ziggy\Ziggy::class)) {
                // Instansiasi Ziggy secara manual untuk mendapatkan config terbaru
                // Ini akan memuat rute dari Route::getRoutes() saat runtime
                $ziggy = new \Tightenco\Ziggy\Ziggy;
                $ziggyConfig = $ziggy->toArray();
            }
        } catch (\Exception $e) {
            // Fallback kosong jika gagal total
        }
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
            // Fallback object minimal
            if (typeof window !== 'undefined') {
                window.Ziggy = { url: '{{ url("/") }}', port: null, defaults: {}, routes: {} };
            }
        </script>
    @endif

    <link rel="stylesheet" href="{{ asset('vendor/futurisme-admin/assets/app.css') }}">
    <script type="module" src="{{ asset('vendor/futurisme-admin/assets/app.js') }}" defer></script>
    
    @inertiaHead
</head>
<body class="fa-bg-gray-100 fa-font-sans fa-antialiased">
    @inertia
</body>
</html>