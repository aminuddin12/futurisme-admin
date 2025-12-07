<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Identitas Situs (General)
    |--------------------------------------------------------------------------
    */
    'site_name' => config('app.name', 'Laravel'), // Menggunakan config app.name bawaan Laravel
    
    // Group APP (Baru)
    'site_desc' => env('APP_DESC', 'Application Description Write Here'),
    'time_format' => env('APP_TIME_FORMAT', '24-HOUR'),
    
    // Konfigurasi Tambahan (Sesuai Permintaan & Best Practice)
    'env' => config('app.env', 'production'), // Menggunakan config app.env
    'debug' => config('app.debug', false), // Menggunakan config app.debug
    'timezone' => config('app.timezone', 'UTC'), // Menggunakan config app.timezone
    'fallback_locale' => config('app.fallback_locale', 'en'), // Menggunakan config app.fallback_locale
    'faker_locale' => config('app.faker_locale', 'en_US'), // Menggunakan config app.faker_locale
    
    'maintenance' => [
        'driver' => config('app.maintenance.driver', 'file'), // Menggunakan config app.maintenance.driver jika ada
        'store' => config('app.maintenance.store', 'database'), // Menggunakan config app.maintenance.store jika ada
    ],

    'site_url' => config('app.url', 'http://localhost'), // Menggunakan config app.url bawaan Laravel
    'locale' => config('app.locale', 'id'), // Menggunakan config app.locale bawaan Laravel
    
    /*
    |--------------------------------------------------------------------------
    | System Configuration
    |--------------------------------------------------------------------------
    */
    // Group System (Diperbarui)
    'logo_url' => env('FUTURISME_LOGO_URL', 'default_logo'),
    'favicon_url' => env('FUTURISME_FAVICON_URL', 'favicon.ico'),
    
    // Prefix URL Admin (untuk login super admin)
    'admin_url_prefix' => env('FUTURISME_ADMIN_URL_PREFIX', 'admin'), // Diganti dari 'url_prefix'
    
    // Konfigurasi Backup
    'enable_backup' => [
        'by_days' => env('FUTURISME_BACKUP_DAY', null), 
        'by_month' => env('FUTURISME_BACKUP_MONTH', null),
    ],

    // Batas Upload File
    'max_file_upload' => env('FUTURISME_MAX_FILE_UPLOAD', 5000), // Dalam Kilobytes (KB), default 5MB

    /*
    |--------------------------------------------------------------------------
    | Authentication Settings
    |--------------------------------------------------------------------------
    */
    // Group Authentication (Diperbarui & Ditambah)
    'auth' => [
        'admin_can_create_user' => env('FUTURISME_AUTH_CAN_CREATE_USER', true),
        
        'public_can_register' => env('FUTURISME_PUBLIC_CAN_REGISTER', false), // Diganti dari 'can_register'
        'public_can_reset_password' => env('FUTURISME_PUBLIC_CAN_RESET_PASSWORD', true), // Diganti dari 'can_reset_password'
        'public_can_verify_account' => env('FUTURISME_PUBLIC_CAN_VERIFY_ACCOUNT', true),
        
        'can_view_log' => env('FUTURISME_AUTH_CAN_VIEW_LOG', false),

        // Settings lama (Verification channels) - Opsional, biarkan atau hapus sesuai kebutuhan
        'verification' => [
            'email' => env('FUTURISME_AUTH_VERIFY_EMAIL', true),
            'phone' => env('FUTURISME_AUTH_VERIFY_PHONE', false),
            'whatsapp' => env('FUTURISME_AUTH_VERIFY_WHATSAPP', false),
            'social_media' => env('FUTURISME_AUTH_VERIFY_SOCIAL', false),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Module & Features (Legacy/Existing)
    |--------------------------------------------------------------------------
    */
    'modules' => [
        'team' => env('FUTURISME_MODULE_TEAM', false),
        'corporate' => env('FUTURISME_MODULE_CORPORATE', false),
        'api_tokens' => env('FUTURISME_MODULE_API_TOKENS', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Appearance / Theme
    |--------------------------------------------------------------------------
    */
    // Group Theme (Diperbarui)
    'theme' => [
        'dark_mode' => env('FUTURISME_THEME_DARK_MODE', true),
        'color_primary' => env('FUTURISME_PRIMARY_COLOR', 'default'),
        'color_secondary' => env('FUTURISME_SECONDARY_COLOR', 'default'),
        'layout_mode' => env('FUTURISME_LAYOUT_MODE', 'full_mode'),
        // 'color_scheme' dihapus/diganti dengan color_primary & color_secondary
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Optional Settings
    |--------------------------------------------------------------------------
    */
    // Group Optional (Social Links)
    'social' => [
        'github' => env('FUTURISME_SOCIAL_GITHUB', 'https://github.com/aminuddin12'),
        'instagram' => env('FUTURISME_SOCIAL_INSTAGRAM', 'https://www.instagram.com/aminuddinadl'),
    ],
];