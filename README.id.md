<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/Resources/svg/FuturismeLogo-admin-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="src/Resources/svg/FuturismeLogo-admin-light.svg">
    <img alt="Futurisme Admin Logo" src="src/Resources/svg/FuturismeLogo-admin-light.svg" width="550">
  </picture>
</p>

<p align="center">
    <strong>Futurisme Admin Panel for Laravel 12</strong><br>
    Paket admin panel modern, kuat, dan siap pakai yang dibangun dengan arsitektur Inertia.js, React, dan Tailwind CSS.
</p>

<p align="center">
    <a href="README.md">🇺🇸 Read English Documentation</a>
</p>

<p align="center">
    <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel" alt="Laravel 12"></a>
    <a href="https://inertiajs.com"><img src="https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=flat-square&logo=inertia" alt="Inertia.js"></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
</p>

---

## 🚀 Tentang Paket

**Futurisme Admin** adalah solusi komprehensif *plug-and-play* yang dirancang untuk menangani kebutuhan panel admin secara efisien. Paket ini dirancang agar tetap terisolasi sepenuhnya dari frontend aplikasi utama Laravel Anda, memastikan bahwa situs publik dan dashboard administratif Anda tidak saling bentrok.

Dengan memanfaatkan teknologi modern, paket ini memberikan pengalaman Single Page Application (SPA) yang mulus tanpa kerumitan membangun API terpisah. Paket ini dilengkapi dengan sistem otentikasi yang aman, tata letak dashboard yang sepenuhnya responsif, dan jalur manajemen aset yang terisolasi, menjadikannya titik awal yang sempurna untuk membangun alat administratif yang kompleks.

### Fitur Utama

* **Instalasi Satu Perintah**:
    Sederhanakan alur kerja Anda dengan satu perintah artisan. Proses instalasi menangani semuanya mulai dari mempublikasikan aset yang telah dikompilasi dan mengonfigurasi dependensi hingga menjalankan migrasi database yang diperlukan, membuat Anda siap bekerja dalam hitungan detik.

* **Lingkungan Terisolasi Penuh**:
    Aset (CSS/JS) dan View dienkapsulasi di dalam paket. Ini berarti konfigurasi Tailwind, komponen React, dan gaya panel admin **tidak akan mencemari atau berkonflik** dengan framework frontend aplikasi utama Anda, memungkinkan pemisahan tanggung jawab yang bersih.

* **Teknologi Modern**:
    Dibangun berdasarkan standar terbaru:
    * **Laravel 12**: Untuk backend yang kuat, aman, dan dapat diskalakan.
    * **Inertia.js**: Untuk membangun SPA modern menggunakan konsep routing sisi server klasik.
    * **React 18**: Untuk membangun komponen UI yang interaktif dan dapat digunakan kembali.
    * **Tailwind CSS**: Untuk styling UI yang cepat dan berbasis utilitas.

* **Peralatan Terkonfigurasi Otomatis**:
    Alat-alat penting seperti **Ziggy** (untuk menggunakan route bernama Laravel di dalam JavaScript) dan **Tailwind CSS** sudah dikonfigurasi secara otomatis. Anda tidak perlu mengatur konfigurasi webpack mix atau vite secara manual untuk panel admin.

* **Skema Database Terpisah**:
    Keamanan adalah prioritas. Paket ini menggunakan tabel `futurisme_admins` khusus untuk pengguna administratif. Pemisahan ini memastikan bahwa kredensial dan logika admin tidak pernah tumpang tindih dengan tabel `users` reguler Anda, memberikan lapisan keamanan dan integritas data tambahan.

## 📦 Instalasi

Karena ini adalah paket kustom (pribadi/lokal), pastikan Anda telah mendaftarkannya di `composer.json` aplikasi utama Anda atau menginstalnya melalui repositori pribadi yang dikonfigurasi.

### Prasyarat
Pastikan lingkungan Anda memenuhi persyaratan berikut sebelum melanjutkan:
* PHP ^8.2
* Laravel 10, 11, atau 12
* Node.js & NPM (untuk membangun ulang aset jika diperlukan)

### 1. Require Paket

Jalankan perintah berikut di terminal proyek Laravel Anda untuk menambahkan dependensi paket:

```bash
composer require aminuddin12/futurisme-admin
````

*(Catatan: Jika paket ini belum dipublikasikan ke Packagist, verifikasi bahwa Anda telah menambahkan jalur lokal atau konfigurasi repositori VCS di file `composer.json` utama Anda).*

### 2\. Jalankan Perintah Instalasi

Cukup jalankan satu perintah ini untuk melakukan bootstrap paket. Perintah ini melakukan serangkaian tugas otomatis: mengunduh dependensi yang diperlukan (seperti Ziggy), mempublikasikan aset build yang telah dikompilasi ke direktori publik Anda, dan mengeksekusi file migrasi.

```bash
php artisan install:futurisme-admin
```

> **Catatan:** Perintah ini memeriksa keberadaan `tightenco/ziggy`. Jika hilang, installer akan secara otomatis menjalankan `composer require tightenco/ziggy` untuk Anda.

## 🛠️ Penggunaan

Setelah proses instalasi selesai, panel admin siap digunakan segera.

### Mengakses Halaman

Buka browser Anda dan navigasikan ke URL berikut untuk berinteraksi dengan panel admin:

  * **Halaman Login**: `/login` (Route ini terdaftar dalam `routes/web.php` paket dan membuat sesi pada guard `futurisme`).
  * **Dashboard**: `/` (Dapat diakses hanya setelah otentikasi berhasil).

### Membuat Admin Baru

Untuk memastikan keamanan, paket ini tidak menyertakan pengguna default "admin/admin". Anda harus membuat pengguna administratif pertama Anda secara manual melalui database atau menggunakan Laravel Tinker.

Jalankan Tinker di terminal Anda:

```bash
php artisan tinker
```

Kemudian jalankan kode PHP berikut untuk melakukan seeding super admin pertama Anda:

```php
\Aminuddin12\FuturismeAdmin\Models\FuturismeAdmin::create([
    'name' => 'Super Admin',
    'email' => 'admin@futurisme.com',
    'password' => 'password', // Model secara otomatis melakukan hash pada password ini
    'is_super_admin' => true, // Memberikan hak akses penuh
]);
```

Setelah dibuat, gunakan email `admin@futurisme.com` dan password `password` untuk masuk ke dashboard. **Sangat disarankan untuk mengubah password ini segera setelah login pertama Anda.**

## 📂 Struktur Folder Penting

Memahami struktur paket dapat membantu jika Anda perlu menyesuaikan atau men-debug:

  * **Configs (`config/auth.php`)**:
    ServiceProvider secara otomatis menyuntikkan konfigurasi Guard dan Provider yang diperlukan di sini saat runtime, jadi Anda tidak perlu mengedit konfigurasi aplikasi Anda secara manual.

  * **Assets (`public/vendor/futurisme-admin/`)**:
    Direktori ini berisi output build Vite yang siap produksi dan dikompilasi (JS dan CSS). Ini adalah file yang disajikan ke browser.

  * **Views (`src/Resources/views/app.blade.php`)**:
    Template Blade root yang menginisialisasi aplikasi Inertia. Ini mencakup tag meta dan referensi skrip yang diperlukan.

  * **Migrations (`src/Database/Migrations/`)**:
    Berisi blueprint untuk tabel `futurisme_admins` dan skema khusus paket lainnya.

## 🔧 Pemecahan Masalah (Troubleshooting)

Jika Anda mengalami masalah tata letak (gaya hilang), error 404 pada aset, atau error konsol JavaScript, ikuti langkah-langkah berikut:

1.  **Bangun Ulang Aset (Mode Pengembangan)**
    Jika Anda telah memodifikasi file sumber, navigasikan ke folder paket dan bangun ulang aset:

    ```bash
    cd vendor/aminuddin12/futurisme-admin
    npm install && npm run build
    ```

2.  **Publikasikan Ulang Aset**
    Jika aset publik terhapus atau rusak, kembali ke root proyek dan jalankan ulang perintah instalasi untuk menyegarkannya:

    ```bash
    php artisan install:futurisme-admin
    ```

3.  **Bersihkan Cache**
    Laravel melakukan cache pada view dan route secara agresif. Jika Anda tidak melihat perubahan Anda, bersihkan cache:

    ```bash
    php artisan view:clear
    php artisan route:clear
    ```

## 📄 Lisensi

Paket ini adalah perangkat lunak open-source yang dilisensikan di bawah [lisensi MIT](https://opensource.org/licenses/MIT). Anda bebas untuk menggunakan, memodifikasi, dan mendistribusikannya sesuai dengan ketentuan lisensi.
