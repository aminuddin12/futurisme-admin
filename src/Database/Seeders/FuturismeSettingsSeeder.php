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
            // --- GROUP: GENERAL ---
            [
                'key' => 'site_name',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'text',
                'group' => 'general',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'site_description',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'textarea',
                'group' => 'general',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'site_url',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'url',
                'group' => 'general',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'logo_url',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'image', // New Image Type
                'group' => 'general',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'locale',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'select', 
                'group' => 'general',
                'by_module' => $moduleName,
            ],
            // New: Contact Info
            [
                'key' => 'contact_phone',
                'value' => null,
                'type' => 'string',
                'form_type' => 'phone', // New Phone Type
                'group' => 'general',
                'by_module' => $moduleName,
            ],

            // --- GROUP: SYSTEM ---
            [
                'key' => 'url_prefix',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'text',
                'group' => 'system',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'maintenance_mode',
                'value' => null,
                'type' => 'boolean',
                'form_type' => 'checkbox', // New Checkbox Type
                'group' => 'system',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'backup_time',
                'value' => null,
                'type' => 'string',
                'form_type' => 'time', // New Time Type
                'group' => 'system',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'max_upload_size',
                'value' => null,
                'type' => 'integer',
                'form_type' => 'number', // New Number Type
                'group' => 'system',
                'by_module' => $moduleName,
            ],

            // --- GROUP: AUTHENTICATION ---
            [
                'key' => 'auth.can_register',
                'value' => null, 
                'type' => 'boolean',
                'form_type' => 'toggle',
                'group' => 'auth',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'auth.can_reset_password',
                'value' => null, 
                'type' => 'boolean',
                'form_type' => 'toggle',
                'group' => 'auth',
                'by_module' => $moduleName,
            ],
            
            // --- GROUP: APPEARANCE ---
            [
                'key' => 'theme.dark_mode',
                'value' => null, 
                'type' => 'boolean',
                'form_type' => 'toggle',
                'group' => 'appearance',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'theme.primary_color',
                'value' => null, 
                'type' => 'string',
                'form_type' => 'color_picker', // New Color Picker
                'group' => 'appearance',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'theme.font_size_scale',
                'value' => null,
                'type' => 'integer',
                'form_type' => 'range', // New Range Slider
                'group' => 'appearance',
                'by_module' => $moduleName,
            ],
            [
                'key' => 'theme.layout_style',
                'value' => null,
                'type' => 'string',
                'form_type' => 'radio', // New Radio Type
                'group' => 'appearance',
                'by_module' => $moduleName,
            ],
        ];

        foreach ($settings as $setting) {
            FuturismeSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}