<?php

namespace Aminuddin12\FuturismeAdmin\Database\Seeders;

use Illuminate\Database\Seeder;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;

class FuturismeSidebarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- KONFIGURASI UMUM ---
        $by_module = 'aminuddin12/futurisme-admin';
        $add_by = 'system';

        // --- DEFINISI GRUP ---
        $mainGroup = 'App Main';
        $managementGroup = 'Management';
        $applicationGroup = 'Application';
        $systemGroup = 'System';
        $userGroup = 'User';

        // =====================================================================
        // GROUP: APP MAIN
        // =====================================================================

        // 1. Dashboard
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Dashboard', 'group' => $mainGroup],
            [
                'url' => '/dashboard', // URL Path
                'route' => 'futurisme.dashboard', // Named Route
                'icon' => 'solar:home-bold-duotone',
                'order' => 1,
                'permission_name' => 'view dashboard',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // 2. Analytics (Contoh)
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Analytics', 'group' => $mainGroup],
            [
                'url' => '/analytics',
                'route' => null, // Contoh tanpa route name
                'icon' => 'solar:chart-square-bold-duotone',
                'order' => 2,
                'permission_name' => 'view analytics',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 0,
            ]
        );

        // =====================================================================
        // GROUP: MANAGEMENT
        // =====================================================================

        // A. User Management (Parent)
        $userMenu = FuturismeSidebar::firstOrCreate(
            ['title' => 'User Management', 'group' => $managementGroup],
            [
                'url' => null,
                'route' => null,
                'icon' => 'solar:users-group-rounded-bold-duotone',
                'order' => 1,
                'permission_name' => 'view users',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

            // Submenu: All Users
            FuturismeSidebar::firstOrCreate(
                ['title' => 'All Users', 'parent_id' => $userMenu->id],
                [
                    'group' => $managementGroup,
                    'url' => '/users',
                    'route' => 'futurisme.users.index', // Pastikan route ini ada nanti
                    'icon' => 'solar:user-circle-bold-duotone',
                    'order' => 1,
                    'permission_name' => 'view users',
                    'by_module' => $by_module,
                    'add_by' => $add_by,
                    'is_active' => 1,
                ]
            );

        // B. Roles & Permissions (Parent)
        $aclMenu = FuturismeSidebar::firstOrCreate(
            ['title' => 'Role & Permissions', 'group' => $managementGroup],
            [
                'url' => null,
                'route' => null,
                'icon' => 'solar:shield-keyhole-bold-duotone',
                'order' => 2,
                'permission_name' => 'view roles',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

            // Submenu: Roles
            FuturismeSidebar::firstOrCreate(
                ['title' => 'Roles', 'parent_id' => $aclMenu->id],
                [
                    'group' => $managementGroup,
                    'url' => '/roles',
                    'route' => 'futurisme.roles.index',
                    'icon' => 'solar:key-minimalistic-square-bold-duotone',
                    'order' => 1,
                    'permission_name' => 'manage roles',
                    'by_module' => $by_module,
                    'add_by' => $add_by,
                    'is_active' => 1,
                ]
            );

            // Submenu: Permissions
            FuturismeSidebar::firstOrCreate(
                ['title' => 'Permissions', 'parent_id' => $aclMenu->id],
                [
                    'group' => $managementGroup,
                    'url' => '/permissions', // Contoh path beda
                    'route' => 'futurisme.roles.index', // Route sama (mungkin tab beda)
                    'icon' => 'solar:lock-keyhole-minimalistic-bold-duotone',
                    'order' => 2,
                    'permission_name' => 'manage permissions',
                    'by_module' => $by_module,
                    'add_by' => $add_by,
                    'is_active' => 1,
                ]
            );

        // =====================================================================
        // GROUP: APPLICATION
        // =====================================================================

        // 1. Transactions
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Transactions', 'group' => $applicationGroup],
            [
                'url' => '/transactions',
                'route' => null,
                'icon' => 'solar:card-transfer-bold-duotone',
                'order' => 1,
                'permission_name' => 'view transactions',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 0,
            ]
        );

        // =====================================================================
        // GROUP: SYSTEM
        // =====================================================================

        // 1. General Settings
        FuturismeSidebar::firstOrCreate(
            ['title' => 'System Settings', 'group' => $systemGroup],
            [
                'url' => '/settings',
                'route' => 'futurisme.settings.index',
                'icon' => 'solar:settings-bold-duotone',
                'order' => 1,
                'permission_name' => 'manage settings',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // 2. Menu Manager
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Menu Manager', 'group' => $systemGroup],
            [
                'url' => '/menus',
                'route' => null,
                'icon' => 'solar:list-bold-duotone',
                'order' => 2,
                'permission_name' => 'manage sidebar',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // 3. System Logs
        FuturismeSidebar::firstOrCreate(
            ['title' => 'System Logs', 'group' => $systemGroup],
            [
                'url' => '/logs',
                'route' => null,
                'icon' => 'solar:clipboard-list-bold-duotone',
                'order' => 3,
                'permission_name' => 'view logs',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // =====================================================================
        // GROUP: USER
        // =====================================================================

        // 1. My Profile
        FuturismeSidebar::firstOrCreate(
            ['title' => 'My Profile', 'group' => $userGroup],
            [
                'url' => '/profile',
                'route' => 'futurisme.profile.edit',
                'icon' => 'solar:user-id-bold-duotone',
                'order' => 1,
                'permission_name' => null,
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );
    }
}