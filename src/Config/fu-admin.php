<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Identitas Situs
    |--------------------------------------------------------------------------
    |
    | Pengaturan dasar untuk nama dan deskripsi yang akan muncul di
    | halaman login dan dashboard admin.
    |
    */
    'site_name' => env('FUTURISME_SITE_NAME', 'Futurisme Admin'),
    'site_description' => env('FUTURISME_SITE_DESCRIPTION', 'The Next Gen Admin Panel'),

    /*
    |--------------------------------------------------------------------------
    | Routing Configuration
    |--------------------------------------------------------------------------
    |
    | Prefix URL untuk mengakses halaman admin.
    | Contoh: jika diisi 'panel', maka url menjadi domain.com/panel
    |
    */
    'url_prefix' => env('FUTURISME_URL_PREFIX', 'admin'),

    /*
    |--------------------------------------------------------------------------
    | Authentication Settings
    |--------------------------------------------------------------------------
    |
    | Mengatur fitur pendaftaran, reset password, dan metode verifikasi.
    |
    */
    'auth' => [
        'can_register' => env('FUTURISME_AUTH_CAN_REGISTER', false),
        'can_reset_password' => env('FUTURISME_AUTH_CAN_RESET_PASSWORD', true),
        
        'verification' => [
            'email' => env('FUTURISME_AUTH_VERIFY_EMAIL', true),
            'phone' => env('FUTURISME_AUTH_VERIFY_PHONE', false),       // SMS Gateway
            'whatsapp' => env('FUTURISME_AUTH_VERIFY_WHATSAPP', false), // WA Gateway
            'social_media' => env('FUTURISME_AUTH_VERIFY_SOCIAL', false), // OAuth (Google, etc)
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Module & Features
    |--------------------------------------------------------------------------
    |
    | Mengaktifkan atau menonaktifkan fitur modul besar.
    |
    */
    'modules' => [
        'team' => env('FUTURISME_MODULE_TEAM', false),           // Manajemen Tim/Kolaborasi
        'corporate' => env('FUTURISME_MODULE_CORPORATE', false), // Mode Multi-tenant/Cabang
        'api_tokens' => env('FUTURISME_MODULE_API_TOKENS', true),// Manajemen API Token (Sanctum)
    ],

    /*
    |--------------------------------------------------------------------------
    | Appearance
    |--------------------------------------------------------------------------
    |
    | Kustomisasi tampilan default panel admin.
    |
    */
    'theme' => [
        'dark_mode' => env('FUTURISME_THEME_DARK_MODE', true),
        'color_scheme' => env('FUTURISME_THEME_COLOR', 'indigo'), // Pilihan: indigo, red, blue, green, amber
    ],
];