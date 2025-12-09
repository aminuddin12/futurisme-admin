<?php

namespace Aminuddin12\FuturismeAdmin\Http\Controllers\Admin;

use Aminuddin12\FuturismeAdmin\Http\Controllers\FuturismeBaseController;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends FuturismeBaseController
{
    public function index()
    {
        // Ambil semua setting dan map menjadi [key => value]
        $settings = FuturismeSetting::all()->pluck('value', 'key');

        return Inertia::render('Settings/Index', [
            'settings' => [
                // --- APP ---
                'app_name' => $settings['app.name'] ?? config('fu-admin.site_name'),
                'app_desc' => $settings['app.desc'] ?? '',
                'app_env' => $settings['app.env'] ?? 'production',
                'app_debug' => filter_var($settings['app.debug'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'app_url' => $settings['app.url'] ?? config('app.url'),
                'app_timezone' => $settings['app.timezone'] ?? 'UTC',
                'app_time_format' => $settings['app.time_format'] ?? '24-Hour',
                'app_locale' => $settings['app.locale'] ?? 'en',
                'app_fallback_locale' => $settings['app.fallback_locale'] ?? 'en',
                'app_faker_locale' => $settings['app.faker_locale'] ?? 'en_US',
                'app_maintenance_driver' => $settings['app.maintenance.driver'] ?? 'file',
                'app_maintenance_store' => $settings['app.maintenance.store'] ?? 'database',

                // --- SYSTEM ---
                'system_logo_url' => $settings['system.logo_url'] ?? null,
                'system_favicon_url' => $settings['system.favicon_url'] ?? null,
                'system_admin_url_prefix' => $settings['system.admin_url_prefix'] ?? 'admin',
                'system_backup_days' => $settings['system.enable_backup.by_days'] ?? '7-Days',
                'system_backup_month' => $settings['system.enable_backup.by_month'] ?? '1-month',
                'system_max_file_upload' => $settings['system.max_file_upload'] ?? 5000,

                // --- AUTH ---
                'auth_admin_create_user' => filter_var($settings['auth.admin_can_create_user'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'auth_public_register' => filter_var($settings['auth.public_can_register'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'auth_public_reset_password' => filter_var($settings['auth.public_can_reset_password'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'auth_verify_account' => filter_var($settings['auth.public_can_verify_account'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'auth_view_log' => filter_var($settings['auth.can_view_log'] ?? false, FILTER_VALIDATE_BOOLEAN),

                // --- THEME ---
                'theme_auto_dark_mode' => filter_var($settings['theme.auto_dark_mode'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'theme_color_primary' => $settings['theme.color_primary'] ?? '#4f46e5',
                'theme_color_secondary' => $settings['theme.color_secondary'] ?? '#ec4899',
                'theme_layout_mode' => $settings['theme.layout_mode'] ?? 'full_mode',
                'theme_profile_position' => $settings['theme.profile_button_position'] ?? 'sidebar',

                // --- SOCIAL ---
                'social_github' => $settings['social.github'] ?? '',
                'social_instagram' => $settings['social.instagram'] ?? '',
            ]
        ]);
    }

    public function update(Request $request)
    {
        // Validasi Lengkap
        $validated = $request->validate([
            // App
            'app_name' => 'required|string|max:255',
            'app_desc' => 'nullable|string',
            'app_env' => 'required|in:production,local,staging,testing',
            'app_debug' => 'boolean',
            'app_url' => 'required|url',
            'app_timezone' => 'required|string',
            'app_time_format' => 'required|in:12-Hour,24-Hour',
            'app_locale' => 'required|string|max:10',
            'app_fallback_locale' => 'required|string|max:10',
            'app_faker_locale' => 'required|string|max:20',
            'app_maintenance_driver' => 'required|in:file,cache',
            'app_maintenance_store' => 'required|in:database,redis,memcached,file,array',

            // System (Files handled separately)
            'system_admin_url_prefix' => 'required|string|alpha_dash',
            'system_backup_days' => 'required|string',
            'system_backup_month' => 'required|string',
            'system_max_file_upload' => 'required|integer',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png,svg|max:1024',

            // Auth
            'auth_admin_create_user' => 'boolean',
            'auth_public_register' => 'boolean',
            'auth_public_reset_password' => 'boolean',
            'auth_verify_account' => 'boolean',
            'auth_view_log' => 'boolean',

            // Theme
            'theme_auto_dark_mode' => 'boolean',
            'theme_color_primary' => 'required|string|regex:/^#[a-fA-F0-9]{6}$/',
            'theme_color_secondary' => 'required|string|regex:/^#[a-fA-F0-9]{6}$/',
            'theme_layout_mode' => 'required|in:full_mode,boxed_mode',
            'theme_profile_position' => 'required|in:sidebar,navbar',

            // Social
            'social_github' => 'nullable|url',
            'social_instagram' => 'nullable|url',
        ]);

        $update = function ($key, $val) {
            FuturismeSetting::updateOrCreate(['key' => $key], ['value' => $val]);
        };

        // --- SAVE APP ---
        $update('app.name', $validated['app_name']);
        $update('app.desc', $validated['app_desc']);
        $update('app.env', $validated['app_env']);
        $update('app.debug', $validated['app_debug'] ? '1' : '0');
        $update('app.url', $validated['app_url']);
        $update('app.timezone', $validated['app_timezone']);
        $update('app.time_format', $validated['app_time_format']);
        $update('app.locale', $validated['app_locale']);
        $update('app.fallback_locale', $validated['app_fallback_locale']);
        $update('app.faker_locale', $validated['app_faker_locale']);
        $update('app.maintenance.driver', $validated['app_maintenance_driver']);
        $update('app.maintenance.store', $validated['app_maintenance_store']);

        // --- SAVE SYSTEM ---
        $update('system.admin_url_prefix', $validated['system_admin_url_prefix']);
        $update('system.enable_backup.by_days', $validated['system_backup_days']);
        $update('system.enable_backup.by_month', $validated['system_backup_month']);
        $update('system.max_file_upload', $validated['system_max_file_upload']);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('public/uploads/system');
            $update('system.logo_url', Storage::url($path));
        }
        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('public/uploads/system');
            $update('system.favicon_url', Storage::url($path));
        }

        // --- SAVE AUTH ---
        $update('auth.admin_can_create_user', $validated['auth_admin_create_user'] ? '1' : '0');
        $update('auth.public_can_register', $validated['auth_public_register'] ? '1' : '0');
        $update('auth.public_can_reset_password', $validated['auth_public_reset_password'] ? '1' : '0');
        $update('auth.public_can_verify_account', $validated['auth_verify_account'] ? '1' : '0');
        $update('auth.can_view_log', $validated['auth_view_log'] ? '1' : '0');

        // --- SAVE THEME ---
        $update('theme.auto_dark_mode', $validated['theme_auto_dark_mode'] ? '1' : '0');
        $update('theme.color_primary', $validated['theme_color_primary']);
        $update('theme.color_secondary', $validated['theme_color_secondary']);
        $update('theme.layout_mode', $validated['theme_layout_mode']);
        $update('theme.profile_button_position', $validated['theme_profile_position']);

        // --- SAVE SOCIAL ---
        $update('social.github', $validated['social_github']);
        $update('social.instagram', $validated['social_instagram']);

        return redirect()->back()->with('success', 'Semua pengaturan berhasil diperbarui.');
    }
}