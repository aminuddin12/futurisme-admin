<?php

namespace Aminuddin12\FuturismeAdmin\Database\Seeders;

use Illuminate\Database\Seeder;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;

class FuturismeSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $moduleName = 'aminuddin12/futurisme-admin';

        $settings = [
            // --- GRUP APP ---
            ['key' => 'app.name', 'title' => 'Application Name', 'value' => null, 'type' => 'string', 'form_type' => 'text', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'app.desc', 'title' => 'Application Description', 'value' => null, 'type' => 'string', 'form_type' => 'textarea', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            // Environment
            ['key' => 'app.env', 'title' => 'Environment', 'value' => null, 'type' => 'string', 'form_type' => 'select', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system', 
                'option' => ['production', 'local', 'staging', 'testing']
            ], 
            
            ['key' => 'app.debug', 'title' => 'Debug Mode', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            // App URL (Updated form_type)
            ['key' => 'app.url', 'title' => 'Application URL', 'value' => null, 'type' => 'string', 'form_type' => 'app-url', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            ['key' => 'app.timezone', 'title' => 'Timezone', 'value' => null, 'type' => 'string', 'form_type' => 'select-search', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system', 'option' => []],
            
            // Time Format (Updated to Radio)
            ['key' => 'app.time_format', 'title' => 'Time Format', 'value' => null, 'type' => 'string', 'form_type' => 'radio', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['12-Hour', '24-Hour']
            ],
            
            ['key' => 'app.locale', 'title' => 'Locale', 'value' => null, 'type' => 'string', 'form_type' => 'select-search', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system', 'option' => []],
            ['key' => 'app.fallback_locale', 'title' => 'Fallback Locale', 'value' => null, 'type' => 'string', 'form_type' => 'select-search', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system', 'option' => []],
            ['key' => 'app.faker_locale', 'title' => 'Faker Locale', 'value' => null, 'type' => 'string', 'form_type' => 'select-search', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system', 'option' => []],
            
            ['key' => 'app.maintenance.driver', 'title' => 'Maintenance Driver', 'value' => null, 'type' => 'string', 'form_type' => 'select', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['file', 'cache']
            ],
            
            ['key' => 'app.maintenance.store', 'title' => 'Maintenance Store', 'value' => null, 'type' => 'string', 'form_type' => 'select', 'group' => 'app', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['database', 'redis', 'memcached', 'file', 'array']
            ],

            // --- GRUP SYSTEM ---
            ['key' => 'system.logo_url', 'title' => 'Logo URL', 'value' => null, 'type' => 'string', 'form_type' => 'image', 'group' => 'system', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'system.favicon_url', 'title' => 'Favicon URL', 'value' => null, 'type' => 'string', 'form_type' => 'image', 'group' => 'system', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            // Admin URL Prefix (Updated form_type)
            ['key' => 'system.admin_url_prefix', 'title' => 'Admin URL Prefix', 'value' => null, 'type' => 'string', 'form_type' => 'app-url-full', 'group' => 'system', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            // Backup by Days (Number Format)
            ['key' => 'system.enable_backup.by_days', 'title' => 'Backup Schedule (Days)', 'value' => null, 'type' => 'string', 'form_type' => 'number-format', 'group' => 'system', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['Day', 'Days', 'Week', 'Weeks']
            ],
            
            // Backup by Month (Number Format)
            ['key' => 'system.enable_backup.by_month', 'title' => 'Backup Schedule (Month)', 'value' => null, 'type' => 'string', 'form_type' => 'number-format', 'group' => 'system', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['month', 'months']
            ],
            
            ['key' => 'system.max_file_upload', 'title' => 'Max File Upload Size', 'value' => null, 'type' => 'integer', 'form_type' => 'number', 'group' => 'system', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'], // Assuming 'number' is cleaner for raw size

            // --- GRUP AUTHENTICATION ---
            ['key' => 'auth.admin_can_create_user', 'title' => 'Admin Can Create User', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'authentication', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'auth.public_can_register', 'title' => 'Public Registration', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'authentication', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'auth.public_can_reset_password', 'title' => 'Public Password Reset', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'authentication', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'auth.public_can_verify_account', 'title' => 'Account Verification', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'authentication', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'auth.can_view_log', 'title' => 'View Log Access', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'authentication', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],

            // --- GRUP THEME ---
            // Auto Dark Mode (Renamed & Title Updated)
            ['key' => 'theme.auto_dark_mode', 'title' => 'Automatic Dark Mode', 'value' => null, 'type' => 'boolean', 'form_type' => 'toggle', 'group' => 'theme', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            ['key' => 'theme.color_primary', 'title' => 'Primary Color', 'value' => null, 'type' => 'string', 'form_type' => 'color_picker', 'group' => 'theme', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'theme.color_secondary', 'title' => 'Secondary Color', 'value' => null, 'type' => 'string', 'form_type' => 'color_picker', 'group' => 'theme', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            
            ['key' => 'theme.layout_mode', 'title' => 'Layout Mode', 'value' => null, 'type' => 'string', 'form_type' => 'radio', 'group' => 'theme', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['full_mode', 'boxed_mode']
            ],

            ['key' => 'theme.profile_button_position', 'title' => 'Profile Button Position', 'value' => null, 'type' => 'string', 'form_type' => 'radio', 'group' => 'theme', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system',
                'option' => ['sidebar', 'navbar']
            ],

            // --- GRUP OPTIONAL ---
            // Social Media (Updated form_type to url-ext)
            ['key' => 'social.github', 'title' => 'Github URL', 'value' => null, 'type' => 'string', 'form_type' => 'url-ext', 'group' => 'optional', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
            ['key' => 'social.instagram', 'title' => 'Instagram URL', 'value' => null, 'type' => 'string', 'form_type' => 'url-ext', 'group' => 'optional', 'by_module' => $moduleName, 'is_active' => 1, 'add_by' => 'system'],
        ];

        foreach ($settings as $setting) {
            FuturismeSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}