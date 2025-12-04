<?php

namespace Aminuddin12\FuturismeAdmin\Database\Seeders;

use Illuminate\Database\Seeder;
use Aminuddin12\FuturismeAdmin\Models\FuturismeRole;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;
use Aminuddin12\FuturismeAdmin\Models\FuturismeSidebar;

class FuturismeDatabaseSeeder extends Seeder
{
    public function run()
    {

        $this->call(FuturismeSettingsSeeder::class);
        // 1. Create Permissions Dasar
        $permissions = [
            'view dashboard',
            'manage users',
            'manage roles',
            'manage sidebar',
            'manage settings',
        ];

        foreach ($permissions as $perm) {
            FuturismePermission::firstOrCreate(['name' => $perm]);
        }

        // 2. Create Roles
        $superAdmin = FuturismeRole::firstOrCreate(['name' => 'Super Admin']);
        // Super Admin punya semua permission (bisa logic via code atau attach all)
        // Di trait HasRoles, kita sudah buat logic is_super_admin bypass permission check.
        // Tapi untuk role ini kita assign juga biar eksplisit.
        $superAdmin->permissions()->sync(FuturismePermission::all());

        $editor = FuturismeRole::firstOrCreate(['name' => 'Editor']);
        $editor->permissions()->sync(FuturismePermission::whereIn('name', ['view dashboard', 'manage users'])->get());

        // 3. Create Default Sidebar Menus
        // Menu Dashboard
        FuturismeSidebar::firstOrCreate([
            'title' => 'Dashboard',
            'url' => 'futurisme.dashboard',
            'icon' => 'heroicons:home',
            'order' => 1,
            'permission_name' => 'view dashboard'
        ]);

        // Menu Management (Parent)
        $mgmtMenu = FuturismeSidebar::firstOrCreate([
            'title' => 'Management',
            'icon' => 'heroicons:cog-6-tooth',
            'order' => 2,
            'permission_name' => 'manage roles' // Butuh salah satu permission
        ]);

        // Submenu: Roles
        FuturismeSidebar::firstOrCreate([
            'title' => 'Roles & Permissions',
            'url' => 'futurisme.roles.index',
            'icon' => 'heroicons:shield-check',
            'parent_id' => $mgmtMenu->id,
            'order' => 1,
            'permission_name' => 'manage roles'
        ]);

        // Submenu: Sidebar
        FuturismeSidebar::firstOrCreate([
            'title' => 'Sidebar Menu',
            'url' => 'futurisme.sidebars.index',
            'icon' => 'heroicons:list-bullet',
            'parent_id' => $mgmtMenu->id,
            'order' => 2,
            'permission_name' => 'manage sidebar'
        ]);

        // Menu Settings
        FuturismeSidebar::firstOrCreate([
            'title' => 'Settings',
            'url' => 'futurisme.settings',
            'icon' => 'heroicons:adjustments-horizontal',
            'order' => 3,
            'permission_name' => 'manage settings'
        ]);
    }
}