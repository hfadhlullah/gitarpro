<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function afterCreate(): void
    {
        $this->syncRoleColumn();
    }

    /**
     * Sync the legacy `role` string column from the user's Spatie roles.
     * super_admin → role='admin', anything else → role='user'
     */
    protected function syncRoleColumn(): void
    {
        $record = $this->record;
        $record->role = $record->hasRole('super_admin') ? 'admin' : 'user';
        $record->saveQuietly();
    }
}
