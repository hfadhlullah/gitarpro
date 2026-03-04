<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Seeds the app-level custom permissions that Shield will display
 * in its Roles editor under "Custom Permissions", alongside the
 * auto-generated Filament resource permissions.
 *
 * Also creates the default `user` role and assigns it the
 * permissions every regular member should have.
 */
class AppPermissionsSeeder extends Seeder
{
    /**
     * Custom permissions for the public-facing app.
     * These appear in Shield's role editor so admins can
     * grant/revoke them per role.
     */
    public const APP_PERMISSIONS = [
        'view_feed' => 'Browse the video feed',
        'upload_video' => 'Upload a video to the feed',
        'view_lessons' => 'Browse the lessons page',
        'submit_lesson' => 'Submit a lesson for review',
    ];

    public function run(): void
    {
        // Create every app-level permission (idempotent)
        foreach (array_keys(self::APP_PERMISSIONS) as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // The default `user` role: can do everything a regular member can
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $userRole->syncPermissions(array_keys(self::APP_PERMISSIONS));
    }
}
