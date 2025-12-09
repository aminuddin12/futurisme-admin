<?php

namespace Aminuddin12\FuturismeAdmin\Database\Seeders;

use Illuminate\Database\Seeder;

class FuturismeDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(FuturismeSettingsSeeder::class);
        $this->call(FuturismeRoleandPermissionSeeder::class);
        $this->call(FuturismeSidebarSeeder::class);
    }
}