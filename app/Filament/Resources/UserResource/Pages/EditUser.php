<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
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
