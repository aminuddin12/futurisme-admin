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
            ['title' => 'Dashboard', 'group' => $mainGroup], // Kunci pencarian unik
            [
                'url' => 'futurisme.dashboard',
                'icon' => 'solar:home-bold-duotone',
                'order' => 1,
                'permission_name' => 'view dashboard',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // 2. Analytics (Contoh Menu Tambahan)
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Analytics', 'group' => $mainGroup],
            [
                'url' => 'futurisme.dashboard', // Bisa diganti route analytics
                'icon' => 'solar:chart-square-bold-duotone',
                'order' => 2,
                'permission_name' => 'view analytics',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 0, // Default non-aktif, contoh
            ]
        );

        // =====================================================================
        // GROUP: MANAGEMENT
        // =====================================================================

        // A. User Management (Parent)
        $userMenu = FuturismeSidebar::firstOrCreate(
            ['title' => 'User Management', 'group' => $managementGroup],
            [
                'url' => null, // Parent menu biasanya null
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
                    'url' => 'futurisme.users.index', // Pastikan route ini ada nanti
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
                    'url' => 'futurisme.roles.index',
                    'icon' => 'solar:key-minimalistic-square-bold-duotone',
                    'order' => 1,
                    'permission_name' => 'manage roles',
                    'by_module' => $by_module,
                    'add_by' => $add_by,
                    'is_active' => 1,
                ]
            );

            // Submenu: Permissions (Contoh jika ingin dipisah)
            // Di controller sebelumnya kita gabung dalam satu halaman, tapi menu bisa dipisah jika mau
            FuturismeSidebar::firstOrCreate(
                ['title' => 'Permissions', 'parent_id' => $aclMenu->id],
                [
                    'group' => $managementGroup,
                    'url' => 'futurisme.roles.index', // Mengarah ke halaman sama tapi mungkin tab beda query
                    'icon' => 'solar:lock-keyhole-minimalistic-bold-duotone',
                    'order' => 2,
                    'permission_name' => 'manage permissions',
                    'by_module' => $by_module,
                    'add_by' => $add_by,
                    'is_active' => 1,
                ]
            );

        // =====================================================================
        // GROUP: APPLICATION (Contoh Modul Masa Depan)
        // =====================================================================

        // 1. Transactions (Contoh)
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Transactions', 'group' => $applicationGroup],
            [
                'url' => '#',
                'icon' => 'solar:card-transfer-bold-duotone',
                'order' => 1,
                'permission_name' => 'view transactions',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 0, // Placeholder
            ]
        );

        // =====================================================================
        // GROUP: SYSTEM
        // =====================================================================

        // 1. General Settings
        FuturismeSidebar::firstOrCreate(
            ['title' => 'System Settings', 'group' => $systemGroup],
            [
                'url' => 'futurisme.settings.index',
                'icon' => 'solar:settings-bold-duotone',
                'order' => 1,
                'permission_name' => 'manage settings',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // 2. Sidebar Manager (Contoh Self-Management)
        FuturismeSidebar::firstOrCreate(
            ['title' => 'Menu Manager', 'group' => $systemGroup],
            [
                'url' => '#', 
                'icon' => 'solar:list-bold-duotone',
                'order' => 2,
                'permission_name' => 'manage sidebar',
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );

        // 3. Logs
        FuturismeSidebar::firstOrCreate(
            ['title' => 'System Logs', 'group' => $systemGroup],
            [
                'url' => '#',
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
                'url' => 'futurisme.profile.edit', // Pastikan route profile ada
                'icon' => 'solar:user-id-bold-duotone',
                'order' => 1,
                'permission_name' => null, // Biasanya semua user login boleh akses
                'by_module' => $by_module,
                'add_by' => $add_by,
                'is_active' => 1,
            ]
        );
    }
}