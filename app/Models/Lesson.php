<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'level',
        'storage_key',
        'status',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a temporary signed URL for the lesson video from MinIO.
     */
    public function signedUrl(int $minutes = 60): ?string
    {
        if (! $this->storage_key) {
            return null;
        }

        return Storage::disk('s3')->temporaryUrl($this->storage_key, now()->addMinutes($minutes));
    }
}
