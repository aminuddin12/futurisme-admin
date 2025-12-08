<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Identitas Situs (General)
    |--------------------------------------------------------------------------
    */
    'site_name' => config('app.name', 'Laravel'),
    'site_desc' => env('APP_DESC', 'Application Description Write Here'),
    'time_format' => env('APP_TIME_FORMAT', '24-HOUR'),
    'env' => config('app.env', 'production'),
    'debug' => config('app.debug', false),
    'timezone' => config('app.timezone', 'UTC'),
    'fallback_locale' => config('app.fallback_locale', 'en'),
    'faker_locale' => config('app.faker_locale', 'en_US'),
    
    'maintenance' => [
        'driver' => config('app.maintenance.driver', 'file'),
        'store' => config('app.maintenance.store', 'database'),
    ],

    'site_url' => config('app.url', 'http://localhost'),
    'locale' => config('app.locale', 'id'), 
    
    /*
    |--------------------------------------------------------------------------
    | System Configuration
    |--------------------------------------------------------------------------
    */
    'logo_url' => env('FUTURISME_LOGO_URL', 'default_logo'),
    'favicon_url' => env('FUTURISME_FAVICON_URL', 'favicon.ico'),
    'admin_url_prefix' => env('FUTURISME_ADMIN_URL_PREFIX', 'admin'),
    'enable_backup' => [
        'by_days' => env('FUTURISME_BACKUP_DAY', null), 
        'by_month' => env('FUTURISME_BACKUP_MONTH', null),
    ],
    'max_file_upload' => env('FUTURISME_MAX_FILE_UPLOAD', 5000),

    /*
    |--------------------------------------------------------------------------
    | Authentication Settings
    |--------------------------------------------------------------------------
    */
    'auth' => [
        'admin_can_create_user' => env('FUTURISME_AUTH_CAN_CREATE_USER', true),
        
        'public_can_register' => env('FUTURISME_PUBLIC_CAN_REGISTER', false),
        'public_can_reset_password' => env('FUTURISME_PUBLIC_CAN_RESET_PASSWORD', true),
        'public_can_verify_account' => env('FUTURISME_PUBLIC_CAN_VERIFY_ACCOUNT', true),
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
    'theme' => [
        'dark_mode' => env('FUTURISME_THEME_DARK_MODE', true),
        'color_primary' => env('FUTURISME_PRIMARY_COLOR', 'default'),
        'color_secondary' => env('FUTURISME_SECONDARY_COLOR', 'default'),
        'layout_mode' => env('FUTURISME_LAYOUT_MODE', 'full_mode'),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Optional Settings
    |--------------------------------------------------------------------------
    */
    'social' => [
        'github' => env('FUTURISME_SOCIAL_GITHUB', 'https://github.com/aminuddin12'),
        'instagram' => env('FUTURISME_SOCIAL_INSTAGRAM', 'https://www.instagram.com/aminuddinadl'),
    ],
];