<?php

namespace Aminuddin12\FuturismeAdmin\Database\Seeders;

use Illuminate\Database\Seeder;
use Aminuddin12\FuturismeAdmin\Models\FuturismeRole;
use Aminuddin12\FuturismeAdmin\Models\FuturismePermission;

class FuturismeRoleandPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guard = 'futurisme'; 
        $add_by = 'system';

        $permissions = [
            'view dashboard',
            'view analytics',
            
            'view users',
            'create user',
            'edit user',
            'delete user',
            'verify user',
            'ban user',

            'view roles',
            'create role',
            'edit role',
            'delete role',
            'view permissions',
            'assign permissions',

            'manage content',
            'publish content',
            
            'view settings',
            'edit settings',
            'manage backups',
            'view logs',
            'manage sidebar',
            
            'super admin dashboard',
            'access api tokens',
        ];

        // --- 2. Eksekusi Pembuatan Permission (Anti Duplikasi) ---
        foreach ($permissions as $permissionName) {
            FuturismePermission::firstOrCreate(
                [
                    'name' => $permissionName, 
                    'guard_name' => $guard
                ],
                [
                    'add_by' => $add_by
                ]
            );
        }

        // --- 3. Pembuatan Roles ---
        
        // A. Super Admin (Dewa)
        $superAdmin = FuturismeRole::firstOrCreate(
            ['name' => 'super-admin', 'guard_name' => $guard],
            ['add_by' => $add_by]
        );

        // B. Admin (Manajer)
        $admin = FuturismeRole::firstOrCreate(
            ['name' => 'admin', 'guard_name' => $guard],
            ['add_by' => $add_by]
        );

        // C. Editor (Konten)
        $editor = FuturismeRole::firstOrCreate(
            ['name' => 'editor', 'guard_name' => $guard],
            ['add_by' => $add_by]
        );

        // D. User (Pengguna Biasa)
        $user = FuturismeRole::firstOrCreate(
            ['name' => 'user', 'guard_name' => $guard],
            ['add_by' => $add_by]
        );

        // --- 4. Assign Permissions ke Roles ---

        // Ambil ID semua permission
        $allPermissions = FuturismePermission::where('guard_name', $guard)->pluck('id')->toArray();

        // -> Super Admin: Dapat SEMUA akses
        $superAdmin->permissions()->sync($allPermissions);

        // -> Admin: Dapat akses manajemen user, role, settings, tapi BUKAN 'super admin dashboard' atau 'delete role' super-admin
        $adminPermissions = FuturismePermission::where('guard_name', $guard)
            ->whereIn('name', [
                'view dashboard', 'view analytics',
                'view users', 'create user', 'edit user', 'verify user',
                'view roles', 'assign permissions',
                'view settings', 'edit settings', 'manage sidebar',
                'view logs',
                'manage content', 'publish content'
            ])->pluck('id')->toArray();
        
        $admin->permissions()->sync($adminPermissions);

        // -> Editor: Hanya manajemen konten
        $editorPermissions = FuturismePermission::where('guard_name', $guard)
            ->whereIn('name', [
                'view dashboard',
                'manage content', 'publish content'
            ])->pluck('id')->toArray();

        $editor->permissions()->sync($editorPermissions);

        // -> User: Hanya dashboard dasar
        $userPermissions = FuturismePermission::where('guard_name', $guard)
            ->whereIn('name', [
                'view dashboard'
            ])->pluck('id')->toArray();

        $user->permissions()->sync($userPermissions);
    }
}