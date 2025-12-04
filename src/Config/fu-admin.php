<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Identitas Situs (General)
    |--------------------------------------------------------------------------
    */
    'site_name' => env('FUTURISME_SITE_NAME', 'Futurisme Admin'),
    'site_description' => env('FUTURISME_SITE_DESCRIPTION', 'The Next Gen Admin Panel'),
    'site_url' => env('APP_URL', 'http://localhost'),
    'locale' => env('APP_LOCALE', 'id'),
    'logo_url' => env('FUTURISME_LOGO_URL', null), // Bisa null jika pakai default package

    /*
    |--------------------------------------------------------------------------
    | Routing Configuration (System)
    |--------------------------------------------------------------------------
    */
    'url_prefix' => env('FUTURISME_URL_PREFIX', 'admin'),

    /*
    |--------------------------------------------------------------------------
    | Authentication Settings
    |--------------------------------------------------------------------------
    */
    'auth' => [
        'can_register' => env('FUTURISME_AUTH_CAN_REGISTER', false),
        'can_reset_password' => env('FUTURISME_AUTH_CAN_RESET_PASSWORD', true),
        
        'verification' => [
            'email' => env('FUTURISME_AUTH_VERIFY_EMAIL', true),
            'phone' => env('FUTURISME_AUTH_VERIFY_PHONE', false),
            'whatsapp' => env('FUTURISME_AUTH_VERIFY_WHATSAPP', false),
            'social_media' => env('FUTURISME_AUTH_VERIFY_SOCIAL', false),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Module & Features
    |--------------------------------------------------------------------------
    */
    'modules' => [
        'team' => env('FUTURISME_MODULE_TEAM', false),
        'corporate' => env('FUTURISME_MODULE_CORPORATE', false),
        'api_tokens' => env('FUTURISME_MODULE_API_TOKENS', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Appearance
    |--------------------------------------------------------------------------
    */
    'theme' => [
        'dark_mode' => env('FUTURISME_THEME_DARK_MODE', true),
        'color_scheme' => env('FUTURISME_THEME_COLOR', 'indigo'),
    ],
];