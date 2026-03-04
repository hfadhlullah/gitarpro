<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tab extends Model
{
    /** @use HasFactory<\Database\Factories\TabFactory> */
    use HasFactory;

    protected $fillable = [
        'video_id',
        'format',
        'content'
    ];

    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
