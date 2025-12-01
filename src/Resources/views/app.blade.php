<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Futurisme Admin</title>

    {{--
      Trik: Kita me-load manifest dari public/vendor/futurisme-admin/.vite/manifest.json
      Untuk simplifikasi di production package, kita bisa meload file entry point langsung
      atau menggunakan helper khusus.
    --}}

    @php
        $manifest = public_path('vendor/futurisme-admin/.vite/manifest.json');
        // Logic untuk parsing manifest dan load CSS/JS file yang benar
        // (Biasanya dibuatkan helper function di ServiceProvider)
    @endphp

    {{-- Placeholder untuk contoh --}}
    <link rel="stylesheet" href="{{ asset('vendor/futurisme-admin/assets/app.css') }}">
    <script type="module" src="{{ asset('vendor/futurisme-admin/assets/app.js') }}" defer></script>
    @inertiaHead
</head>
<body class="fa-bg-gray-100"> <!-- Menggunakan Prefix fa- -->
    @inertia
</body>
</html>
