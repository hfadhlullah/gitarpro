<?php

namespace Database\Seeders;

use App\Models\User;
use BezhanSalleh\FilamentShield\Support\Utils;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Ensure the super_admin role exists (Shield uses this to bypass all checks)
        $superAdminRole = Role::firstOrCreate(
            ['name' => Utils::getSuperAdminName(), 'guard_name' => 'web']
        );

        // Admin user — NOT registerable through the app
        $admin = User::updateOrCreate(
            ['email' => 'admin@mail.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('admin123123'),
                'role' => 'admin',
            ]
        );

        // Assign Shield super_admin role so they bypass all permission checks
        $admin->assignRole($superAdminRole);

        // Seed app-level custom permissions and the default `user` role
        $this->call(AppPermissionsSeeder::class);
    }
}
