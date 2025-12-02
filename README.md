<p align="center">
  <picture>
    <!-- Logo untuk Tema Gelap -->
    <source media="(prefers-color-scheme: dark)" srcset="src/Resources/svg/FuturismeLogo-admin-dark.svg">
    <!-- Logo untuk Tema Terang -->
    <source media="(prefers-color-scheme: light)" srcset="src/Resources/svg/FuturismeLogo-admin-light.svg">
    <!-- Fallback & Default Image -->
    <img alt="Futurisme Admin Logo" src="src/Resources/svg/FuturismeLogo-admin-light.svg" width="550">
  </picture>
</p>

<p align="center">
    <strong>Futurisme Admin Panel for Laravel 12</strong><br>
    Paket admin panel modern berbasis Inertia.js, React, dan Tailwind CSS yang siap pakai.
</p>

<p align="center">
    <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel" alt="Laravel 12"></a>
    <a href="https://inertiajs.com"><img src="https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=flat-square&logo=inertia" alt="Inertia.js"></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
</p>

---

## 🚀 Tentang Paket

**Futurisme Admin** adalah solusi *plug-and-play* untuk kebutuhan halaman admin yang terpisah dari *frontend* utama aplikasi Laravel Anda. Paket ini menyediakan sistem otentikasi lengkap, dashboard responsif, dan manajemen aset yang terisolasi menggunakan teknologi modern.

### Fitur Utama
- **Instalasi Satu Perintah**: Setup otomatis asset, database, dan dependency.
- **Terisolasi**: Aset (CSS/JS) dan View tidak mencemari struktur folder utama aplikasi.
- **Modern Stack**: Dibangun dengan Laravel 12, Inertia.js (React), dan Tailwind CSS.
- **Auto-Configured**: Ziggy (Routes) dan Tailwind sudah terkonfigurasi otomatis.
- **Database Terpisah**: Migrasi tabel admin (`futurisme_admins`) berjalan otomatis tanpa perlu konfigurasi manual.

## 📦 Instalasi

Karena ini adalah paket kustom (private/local), pastikan Anda telah mendaftarkannya di `composer.json` aplikasi utama Anda atau menginstalnya melalui repository.

### 1. Require Paket
Jalankan perintah berikut di terminal proyek Laravel Anda:

```bash
composer require aminuddin12/futurisme-admin
````

*(Jika paket ini belum dipublikasikan ke Packagist, pastikan Anda telah menambahkan konfigurasi repository lokal di composer.json utama).*

### 2\. Jalankan Perintah Instalasi

Cukup jalankan satu perintah ini. Paket akan otomatis mengunduh dependensi (seperti Ziggy), mempublikasikan aset, dan menjalankan migrasi database.

```bash
php artisan install:futurisme-admin
```

> **Catatan:** Perintah ini akan otomatis menjalankan `composer require tightenco/ziggy` jika belum terinstal.

## 🛠️ Penggunaan

Setelah instalasi selesai, Anda dapat langsung mengakses halaman admin.

### Akses Halaman

Buka browser dan akses URL berikut:

  - **Login Page**: `/login` (atau sesuai route yang didefinisikan di `routes/web.php` paket)
  - **Dashboard**: `/` (setelah login)

### Membuat Admin Baru

Untuk saat ini, Anda dapat menambahkan user admin secara manual melalui database atau tinker:

```bash
php artisan tinker
```

Lalu jalankan kode berikut:

```php
\Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin::create([
    'name' => 'Super Admin',
    'email' => 'admin@futurisme.com',
    'password' => 'password', // Password akan otomatis di-hash
    'is_super_admin' => true,
]);
```

Gunakan email `admin@futurisme.com` dan password `password` untuk login.

## 📂 Struktur Folder Penting

  - **Configs**: `config/auth.php` (Guard & Provider otomatis ditambahkan via ServiceProvider).
  - **Assets**: `public/vendor/futurisme-admin/` (File hasil build Vite).
  - **Views**: `src/Resources/views/app.blade.php` (Layout dasar Inertia).
  - **Migrations**: `src/Database/Migrations/` (File migrasi database).

## 🔧 Troubleshooting

Jika Anda mengalami masalah tampilan (style hilang) atau error JavaScript:

1.  **Build Ulang Aset (Development)**
    Masuk ke folder paket dan jalankan build:

    ```bash
    cd vendor/aminuddin12/futurisme-admin
    npm install && npm run build
    ```

2.  **Publish Ulang Aset**
    Kembali ke root project dan jalankan ulang install:

    ```bash
    php artisan install:futurisme-admin
    ```

3.  **Bersihkan Cache**

    ```bash
    php artisan view:clear
    php artisan route:clear
    ```

## 📄 Lisensi

Paket ini adalah perangkat lunak open-source di bawah lisensi [MIT](https://opensource.org/licenses/MIT).
