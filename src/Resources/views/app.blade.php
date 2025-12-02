<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Futurisme Admin</title>

    @php
        $manifest = public_path('vendor/futurisme-admin/.vite/manifest.json');
    @endphp

    <link rel="stylesheet" href="{{ asset('vendor/futurisme-admin/assets/app.css') }}">
    
    {{-- PERBAIKAN: Menggunakan PHP native alih-alih directive @routes --}}
    {{-- Ini memastikan config Ziggy tetap ter-render meskipun directive blade bermasalah --}}
    @if (app()->bound('ziggy'))
        <script>
            const Ziggy = {!! json_encode(app('ziggy')->toArray()['url'] ? app('ziggy')->toArray() : []) !!};
            if (typeof window !== 'undefined') {
                Object.assign(window.Ziggy || {}, Ziggy);
            }
        </script>
    @else
        <script>
            console.error('Ziggy not found. Please run: composer require tightenco/ziggy');
        </script>
    @endif
    
    <script type="module" src="{{ asset('vendor/futurisme-admin/assets/app.js') }}" defer></script>
    @inertiaHead
</head>
<body class="fa-bg-gray-100">
    @inertia
</body>
</html>